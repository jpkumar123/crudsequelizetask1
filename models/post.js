export default  (sequelize, {INTEGER, STRING}) => {

    const Post = sequelize.define("post", {
        id : {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: STRING,
        },
        description: {
            type: STRING
        },
        user_id:{
            type: INTEGER
        },
        });
       Post.associate = (models) =>{
           Post.belongsTo(models.User, {
               foreignKey:"user_id",
               as: "author"
           });
       };
       

    return Post;
   
    };
   