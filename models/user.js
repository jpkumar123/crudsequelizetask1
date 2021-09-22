module.exports = ( sequelize,Sequelize) => {

    const User = sequelize.define("user", {
        email: {
            type: Sequelize.STRING,
            validate:{
                isEmail: true
            }
        },

        password: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        },

        name:{
            type:Sequelize.STRING
        },
        mobilenumber:{
            type:Sequelize.INTEGER,
            validate:{
                len:[0,11]
            }
        }
             
    });

    return User;

};


