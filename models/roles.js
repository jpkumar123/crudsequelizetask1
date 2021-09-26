import {Model} from 'sequelize';

export default (sequelize, {STRING}) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  roles.init({
    user: STRING,
    description: STRING
  }, {
    sequelize,
    modelName: 'roles',
  });
  return roles;
};