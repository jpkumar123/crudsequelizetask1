import express from "express";
import Sequelize from "sequelize";
import bcrypt from "bcrypt";

const app = express();
const port = 8000;
import jwt from "jsonwebtoken";
import db from "./models/index.js";
const saltRounds = 10;
app.use(express.json());
db.sequelize.sync();

import dotenv from "dotenv";

dotenv.config();
const TOKEN_KEY = "process.env.TOKEN_KEY";



app.get("/get", (req, res) => {
  db.user.findAll({});
});

app.post("/signup", ({ body }, res) => {
  let { email, password, name, mobilenumber } = body;
  body.role = 2;
  // existing or not
  db.users
    .findAll({ where: { email } })
    .then(({ length }) => {
      if (length == 0) {
        return insertUser(body, res);
      }
      res.status(400).send({ message: "user is already existing" });
    })
    .catch(({ message }) => res.status(500).send({ message: message }));
});

app.post("/login", ({ body }, res) => {
  let { email, password, name, mobilenumber } = body;
  db.users
    .findOne({ where: { email } })
    .then((user) => {
      if (user == null)
        return res.status(404).send({
          status: "Not found",
          message: " user not found with that email.",
        });
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send({ message: err.message });
        if (!result) {
          return res.status(400).send({ message: "Invalid Credentials." });
        }
        
        const token = jwt.sign({ id: user.id, email: user.email }, TOKEN_KEY
          );
        user.password = undefined;
        return res.status(200).send({
          user: user,
          token: token,
          status: "loginsuccess",
        });
      });
    })
    .catch(({ message }) => res.status(500).send({ message: message }));
});

const insertUser = (user, res) => {
  console.log(user);
  bcrypt.hash(user.password, saltRounds, (err, hashValue) => {
    if (err) res.status(500).send({ message: err.message });
    db.users
      .create({
        email: user.email,
        password: hashValue,
        name: user.name,
        mobilenumber: user.mobilenumber,
        role: user.role,
      })
      .then((data) =>
        res.send({ name: user.name, message: "registrationsuccess" })
      )
      .catch(({ message }) => {
        res.status(500).send({ message: message });
      });
  });
};

const isAuthorized = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    const decodedToken = jwt.verify(auth, TOKEN_KEY);
    console.log({
      decodedToken,
    });
    const user = await db.users.findOne({ where: { id: decodedToken.id } });
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error("not authorized");
    }
  } catch (err) {
    //

    res.status(400).send("Invaliduser");
  }
};

const isAdmin = async ({ user }, res, next) => {
  const currentUser = user;
  const currentUserId = currentUser.id;

  try {
    const userInfo = await db.users.findOne({ where: { id: currentUserId } });
    if (userInfo.role === 1) {
      next();
    } else {
      throw new Error("not a admin");
    }
  } catch (err) {
    res.status(400).end(err.message);
  }
};
app.post("/makeadmin", isAuthorized, isAdmin, async ({ body }, res) => {
  const { userId } = body;
  try {
    const userToUpdate = await db.users.findOne({ where: { id: userId } });
    if (userToUpdate) {
      await userToUpdate.update({
        role: 1,
      });
    } else {
      throw new Error("user not found");
    }

    res.status(200).json({ status: `${userId} been made as admin` });
  } catch (err) {
    res.status(400).end(err.message);
  }
});

app.post("/post", isAuthorized, async ({ body, user }, res) => {
  const { title, description } = body;

  const payload = {
    title,
    description,
    user_id: user.id,
  };

  console.log("debug", payload);

  try {
    const newPost = await db.post.create(payload);
    res.status(200).send(newPost);
  } catch (error) {
    res.status(401).end("Invaliduser");
  }
});
app.put("/post/:postId", isAuthorized, async ({ params, body }, res, next) => {
  const postId = params.postId;
  const title = body.title;
  const description = body.description;

  const post = await db.post.findOne({ where: { id: postId } });
  console.log({
    post,
  });

  try {
    if (post) {
      // post.dataValues.title = title;
      // post.dataValues.description = description;
      await post.update({
        title,
        description,
      });
      res.status(200).send({ status: "success", post });
    } else {
      res.send("Invaliduserid");
      throw new Error("Invalid userId");
    }
  } catch (err) {
    console.log(err);
    res.status(400).end();
  }
});

app.get("/userposts/:postId", isAuthorized, async ({ params }, res) => {
  try {
    // # of posts
    //list of posts

    const postId = params.postId;
    const posts = await db.post.findOne({
      where: {
        Id: postId,
      },
    });

    res.send({
      count: posts.length,
      posts,
    });
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});

app.get("/myposts", isAuthorized, async ({ user }, res) => {
  const userId = user.id;

  try {
    // # of posts
    const userId = user.id;
    const posts = await db.post.findOne({
      where: {
        Id: userId,
      },
    });

    res.send({
      count: posts.length,
      posts,
    });
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});

app.get(
  "/dashboard/:userId",
  isAuthorized,
  isAdmin,
  async ({ params }, res) => {
    try {
      //
      const userId = params.userId;

      const allPosts = await db.post.findAll({ where: { user_id: userId } });

      const response = {
        postCount: allPosts.length,
        allPosts,
      };
      res.send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  }
);
app.get("/allposts", isAuthorized, isAdmin, async (req, res) => {
  try {
    // # of posts
    //list of posts

    const posts = await db.post.findAll();

    res.send({
      posts,
    });
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});
app.delete("/post", isAuthorized, async ({ body }, res, next) => {
  try {
    const id = body.id;
    const title = body.title;
    const description = body.description;
    const post = await db.post.findOne({ where: { id } });
    console.log({
      post,
    });
    if (post) {
      post.title = title;
      post.description = description;
      await post.destroy();
      res.status(200).send({ status: "success" });
    } else {
      throw new Error("post not found");
    }
  } catch (err) {
    console.log(err);
    res.status(400).end();
  }
});

app.listen(port, () => {
  console.log("Express app started.");
});
