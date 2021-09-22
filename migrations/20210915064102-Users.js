'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      return [ queryInterface.addColumn(
                'users',
                'name',
                 Sequelize.STRING
               ),
              queryInterface.addColumn(
               'users',
               'mobilenumber',
               Sequelize.INTEGER
              )];
  },

  down: async (queryInterface, Sequelize) => {
    return [ queryInterface.removeColumn(
      'users',
      'name',
       Sequelize.STRING
     ),
    queryInterface.removeColumn(
     'users',
     'mobilenumber',
     Sequelize.INTEGER
    )];
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
