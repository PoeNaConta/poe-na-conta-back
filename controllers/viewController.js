const { Op } = require('sequelize');
const ViewBalance = require('../models/ViewBalance');
const ViewCategory = require('../models/ViewCategory');
const ViewDebtsNGains = require('../models/ViewDebtsNGains');
const ViewCategoryDebts = require('../models/ViewCategoryDebts');

exports.getBalanceDebts = async (req, res) => {
  try {
    const viewbalance = await ViewBalance.findByPk(req.user.id);

    if (!viewbalance) {
      return res.json('0');
    }

    return res.status(200).json(viewbalance.debts);
  } catch (error) {
    console.error('Erro ao buscar o resumo de saldo:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno ao buscar resumo de saldo' });
  }
};

exports.getBalanceGains = async (req, res) => {
  try {
    const viewbalance = await ViewBalance.findByPk(req.user.id);

    if (!viewbalance) {
      return res.json('0');
    }

    return res.status(200).json(viewbalance.gains);
  } catch (error) {
    console.error('Erro ao buscar o resumo de saldo:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno ao buscar resumo de saldo' });
  }
};

exports.getBalanceTotal = async (req, res) => {
  try {
    const viewbalance = await ViewBalance.findByPk(req.user.id);

    if (!viewbalance) {
      return res.json('0');
    }

    return res.status(200).json(viewbalance.total);
  } catch (error) {
    console.error('Erro ao buscar o resumo de saldo:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno ao buscar resumo de saldo' });
  }
};

exports.getBalanceCategories = async (req, res) => {
  try {
    const categories = await ViewCategory.findAll({
      attributes: ['category', 'balance'],
      where: { client_id: req.user.id },
    });

    if (!categories) {
      return res.json([]);
    }
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao buscar o resumo de saldo por categoria:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar o saldo' });
  }
};

exports.getCategoryAllDebts = async (req, res) => {
  try {
    const categories = await ViewCategoryDebts.findAll({
      attributes: ['category', 'debts'],
      where: { client_id: req.user.id },
    });

    if (!categories) {
      return res.json([]);
    }
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao buscar o resumo de gastos por categoria:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar os gastos' });
  }
};

exports.getBalanceAllDebts = async (req, res) => {
  try {
    const results = await ViewDebtsNGains.findAll({
      attributes: ['title', 'balance', 'createdat'],
      where: {
        id: req.user.id,
        balance: { [Op.lt]: 0 },
      },
    });

    if (!results) {
      return res.json([]);
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Erro ao buscar as transações', error);
    return res.status(500).json({ error: 'Erro interno ao buscar transações' });
  }
};

exports.getBalanceAllGains = async (req, res) => {
  try {
    const results = await ViewDebtsNGains.findAll({
      attributes: ['title', 'balance', 'createdat'],
      where: {
        id: req.user.id,
        balance: { [Op.gt]: 0 },
      },
    });

    if (!results) {
      return res.json([]);
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Erro ao buscar as transações', error);
    return res.status(500).json({ error: 'Erro interno ao buscar transações' });
  }
};
