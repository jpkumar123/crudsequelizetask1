import dbConfig from "../dbconfig.js";
import userModel from "./user.js";
import postModel from "./Post.js";
import roleModel from "./role.js";

import Sequelize from "sequelize";
const sequelize = new Sequelize(dbConfig.DB, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  operatorAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});




const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize, Sequelize);
db.users = userModel(sequelize, Sequelize);
db.Post = postModel(sequelize, Sequelize);
db.Role = roleModel(sequelize, Sequelize);


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
export default db;
