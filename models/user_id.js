import {Model} from 'sequelize';

export default (sequelize, {INTEGER}) => {
  class user_id extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user_id.init({
    user_id: INTEGER
  }, {
    sequelize,
    modelName: 'user_id',
  });
  return user_id;
};