'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [ queryInterface.addColumn(
      'users',
      'role',
       Sequelize.INTEGER
     ),
    ]},

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'role',
      Sequelize.INTEGER
    );

    /**
     * Add reverting commands here.
sel     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
