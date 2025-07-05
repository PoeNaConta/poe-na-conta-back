const User = require('./User');
const Transaction = require('./Transaction');
const Category = require('./Category');
const ViewBalance = require('./ViewBalance');
const ViewCategory = require('./ViewCategory');
const ViewDebtsNGains = require('./ViewDebtsNGains');

Category.belongsTo(User, { foreignKey: 'client_id' });
// Category.hasMany(Transaction, { foreignKey: 'category_id' });

Transaction.belongsTo(User, { foreignKey: 'client_id' });
Transaction.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  User,
  Transaction,
  Category,
  ViewBalance,
  ViewCategory,
  ViewDebtsNGains,
};
