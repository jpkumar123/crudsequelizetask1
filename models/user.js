export default (sequelize, {STRING, INTEGER}) => {

    const User = sequelize.define("user", {
        email: {
            type: STRING,
            validate:{
                isEmail: true
            }
        },

        password: {
            type: STRING
        },
        role: {
            type: STRING
        },

        name:{
            type:STRING
        },
        mobilenumber:{
            type:INTEGER,
            validate:{
                len:[0,11]
            }
        }
             
    });

    return User;

};


