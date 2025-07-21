const DataTypes = require('sequelize');
const sequelize = require('../config/database');

const viewCategoryDebts = sequelize.define('viewcategorydebts', {
    category_id: {
      type: DataTypes.INTEGER,
      field: 'category_id',
    },
    category: {
      type: DataTypes.TEXT,
      field: 'category',
    },
    client_id: {
      type: DataTypes.INTEGER,
      field: 'client_id',
    },
    debts: {
      type: DataTypes.DECIMAL,
      field: 'debts',
    },
});

module.exports = viewCategoryDebts;
