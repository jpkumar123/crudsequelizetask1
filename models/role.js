export default (sequelize, {INTEGER, STRING}) => {
  const Role = sequelize.define("roles", {
    id: {
      type: INTEGER,
      primaryKey: true
    },
    name: {
      type: STRING
    }
  });

  return Role;
};