const dbConfig = require('../dbconfig.js')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    
    },

);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require('./user.js')(sequelize, Sequelize);
db.post  = require('./post.js')(sequelize,Sequelize);
module.exports = db;