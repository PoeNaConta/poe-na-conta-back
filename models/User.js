const DataTypes = require('sequelize');
const sequelize = require('../config/database');
const Transaction = require('./Transaction');
const Category = require('./Category');

// Define o modelo 'User' que representa a tabela 'clients' no bd
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name',
    },
    useremail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'useremail',
    },
    passwordhash: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'passwordhash',
    },
    premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'premium',
    },
    createdat: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'createdat',
    },
    emailverified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'emailverified',
    },
  },
  {
    tableName: 'clients',
    timestamps: false,
  },
);

User.hasMany(Transaction, { foreignKey: 'client_id' });
User.hasMany(Category, { foreignKey: 'client_id' });

module.exports = User;
