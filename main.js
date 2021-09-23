const express = require("express");
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('./models');
const app = express();
const port = 8000
const jwt = require('jsonwebtoken')
const saltRounds = 10;
app.use(express.json());
db.sequelize.sync();
const TOKEN_KEY = "njnfiwiufo";
require("dotenv").config();
const expressValidator = require('express-validator');

app.get('/get',(req,res)=>{
    db.user.findAll({})
})



app.post("/signup", (req, res) => {

    let {email,password,name,mobilenumber} = req.body;
         req.body.role=2
    // existing or not 
    db.users.findAll({ where: { email: email } }).then((data) => {
        if (data.length == 0) {
        
        
 return insertUser(req.body,res)
     
        }
        res.status(400).send({  message: "user is already existing" });
    }).catch((err) => res.status(500).send({ message: err.message }));
});

app.post("/login", (req, res) => {
    let { email, password,name,mobilenumber} = req.body;
    db.users.findOne({ where: { email: email } }).then((user) => {
        if (user == null) return res.status(404).send({ status: "Not found", message: " user not found with that email." });
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(500).send({ message: err.message });
            if (!result) {
               return res.status(400).send({  message: "Invalid Credentials." });
            }
            const  expiresIn  =  24  *  60  *  60 * 1000;
            const  token  =  jwt.sign({ id:  user.id , email:user.email},TOKEN_KEY, {
                expiresIn
            });
            user.password = undefined;
           return res.status(200).send({ "user":  user, "token":  token, "expires_in":  expiresIn, status: "loginsuccess"})

        });
    }).catch((err) => res.status(500).send({ message: err.message }));
});
     
const insertUser = (user, res) => {
    console.log(user)
    bcrypt.hash(user.password, saltRounds, (err, hashValue) => {
        if (err) res.status(500).send({ message: err.message });
        db.users.create({ email: user.email, password: hashValue,name:user.name,mobilenumber:user.mobilenumber,role:user.role}).then((data) => res.send({name: user.name,message:"registrationsuccess"})).catch((err) => {
            res.status(500).send({ message: err.message });
        })
        
    })
}



const isAuthorized =  async (req, res, next) => {
    
    try{
        

        const auth = req.headers.authorization

    
        const decodedToken = jwt.verify(auth, TOKEN_KEY);
        console.log({
            decodedToken
        })
        const user = await db.users.findOne({where: { id: decodedToken.id }});
        if(user){
            req.user = user;
            next();
        }else{
            throw new Error("not authorized");
        }
    }catch(err){
                // 
              
        res.status(400).send("Invaliduser");
    }

}

const isAdmin = async (req, res, next)=>{
    const currentUser = req.user;
    const currentUserId = currentUser.id;

  try{
    const userInfo = await db.users.findOne({ where: { id: currentUserId }});
    if(userInfo.role === 1){
        next();
    }else{
        throw new Error("not a admin");
    }
  }catch(err){
      res.status(400).end(err.message);
  }

}
app.post("/makeadmin", isAuthorized, isAdmin, async (req,res)=>{
    const { userId } = req.body;
    try{
        const userToUpdate = await db.users.findOne({ where: {  id: userId} });
        if(userToUpdate){
           await userToUpdate.update({
                role: 1
            });
    
        }else{
            throw new Error("user not found");
        }

        res.status(200).json({ status: `${userId} been made as admin`});
    }catch(err){
        res.status(400).end(err.message);
    }
})

 app.post("/post",isAuthorized,async (req,res)=>{
     const { 
        title,
        description
     } = req.body;

     const payload = {
         title:title,
         description,
         user_id: req.user.id
     }

     console.log( "debug",
         payload
     )
    
     try{
        const newPost = await db.post.create(payload);
        res.status(200).send(newPost);
    }catch(error){
        res.status(401).end("Invaliduser");
    }
    
    
 })
 app.put('/post/:postId', isAuthorized,async (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const description = req.body. description;

     const post = await db.post.findOne({ where: {id: postId} });
     console.log({
         post
     });

    try{
        if(post){
            // post.dataValues.title = title;
            // post.dataValues.description = description;
            await post.update(
                {
                    title:title,
                    description:description                  
                }
            );
            res.status(200).send({ status:"success",post:post});
         }else{
            res.send("Invaliduserid");
             throw new Error("Invalid userId");
             
         }
    }catch(err){
        console.log(err);
        res.status(400).end();
    }

  });


  app.get("/userposts/:postId",isAuthorized, async(req, res)=>{
    try{
        // # of posts
        //list of posts

        const postId = req.params.postId;
       const posts = await db.post.findOne ({where:{
            Id:postId
        }})

        res.send({
            count : posts.length,
            posts: posts
        })

    }catch(err){
        res.status(400).send({
            error: err.message
        })
    }
});

app.get("/myposts",isAuthorized, async(req, res)=>{
    
        
        const userId = req.user.id
    
   
   
    try{
        // # of posts
        const userId = req.user.id;
       const posts = await db.post.findOne ({where:{
            Id:userId
        }})

        res.send({
            count : posts.length,
            posts: posts
        })

    }catch(err){
        res.status(400).send({
            error: err.message
        })
    }
});


app.get('/dashboard/:userId',isAuthorized, isAdmin,async(req,res) =>{
      try {
        //  
        const userId = req.params.userId;

        const allPosts = await db.post.findAll({ where : { user_id: userId}});

        const response = {
            postCount: allPosts.length,
            allPosts
        }
        res.send(response);

      } catch (error) {
          res.status(400).send(error);
      }
});
app.get("/allposts",isAuthorized, isAdmin, async(req, res)=>{
    try{
        // # of posts
        //list of posts

        
       const posts = await db.post.findAll();

        res.send({
           posts: posts
        })

    }catch(err){
        res.status(400).send({
            error: err.message
        })
    }
});
  app.delete('/post', isAuthorized,async (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const description = req.body. description;
  
       const post = await db.post.findOne({ where: {id: id} });
       console.log({
           post
       });
  
      try{
          if(post){
              post.title = title;
              post.description = description;
              await post.destroy();
              res.status(200).send({ status:"success"});
           }else{
               throw new Error("post not found");
           }
      }catch(err){
          console.log(err);
          res.status(400).end();
      }
  

      
    });






app.listen(port, () => {
    console.log("Express app started.");
});


