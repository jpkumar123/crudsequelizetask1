export default (sequelize, {INTEGER, STRING}) => {


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
        }
        });
    
    return Post;
    };