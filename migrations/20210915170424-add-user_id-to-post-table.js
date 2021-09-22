'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('posts', 'user_id',Sequelize.INTEGER);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('posts', 'user_id', {
      type: Sequelize.INTEGER
    });
  }
};
