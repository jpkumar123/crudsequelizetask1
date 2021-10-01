
export default {
  
    host: "localhost",
    port : 3306,
    user: "root",
    password: "prasanth@123",
    DB: "mysql",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 100000
    }
};

const db = {};

import Sequelize from 'sequelize';

