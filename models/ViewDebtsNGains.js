const DataTypes = require('sequelize');
const sequelize = require('../config/database');

const viewDebtsNGains = sequelize.define('viewDebtsNGains', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'id',
  },
  title: {
    type: DataTypes.TEXT,
    field: 'title',
  },
  balance: {
    type: DataTypes.DECIMAL,
    field: 'balance',
  },
  createdat: {
    type: DataTypes.DATE,
    field: 'createdat',
  },
});

module.exports = viewDebtsNGains;
