const DataTypes = require('sequelize');
const sequelize = require('../config/database');
const Transaction = require('./Transaction');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'client_id',
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'name',
    },
  },
  {
    tableName: 'categories',
    timestamps: false,
  },
);

Category.hasMany(Transaction, { foreignKey: 'category_id' });

module.exports = Category;
