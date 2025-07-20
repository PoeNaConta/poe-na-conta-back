const DataTypes = require('sequelize');
const sequelize = require('../config/database');

const viewCategories = sequelize.define(
  'ViewCategory',
  {
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
    balance: {
      type: DataTypes.DECIMAL,
      field: 'balance',
    },
  },
  {
    tableName: 'viewcategories',
    timestamps: false,
  },
);

module.exports = viewCategories;
