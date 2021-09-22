module.exports = ( sequelize,Sequelize) => {


const Post = sequelize.define("post", {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.STRING
    },
    user_id:{
        type: Sequelize.INTEGER
    }
    });

return Post;
};