const Category = require('../models/Category');

exports.create = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: 'Preencha o nome da categoria' });
    }

    const client_id = req.user.id;

    const count = await Category.count({ where: { client_id } });

    if (count >= 5 && !req.user.premium) {
      return res
        .status(403)
        .json({ message: 'Usuários free só podem ter até 5 categorias' });
    }

    const categoryBody = {
      name,
      client_id,
    };

    await Category.create(categoryBody);

    res.status(201).json({
      message: 'Categoria criada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro interno ao criar categoria.' });
  }
};

// Listar todas
exports.listAll = async (req, res) => {
  try {
    const client_id = req.user.id;

    const categories = await Category.findAll({
      where: { client_id },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro interno ao listar categorias.' });
  }
};

//Lista os gastos de uma categoria
exports.listOne = async (req, res) => {
  try {
    const {id} = req.body;
    const client_id = req.user.id;

    const categories = await Category.findAll({
      where: { id, client_id },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro interno ao listar categorias.' });
  }
};

//Atualizar
exports.update = async (req, res) => {
  const { id, name } = req.body;

  try {
    const client_id = req.user.id;

    const category = await Category.findOne({
      where: { id, client_id },
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    const updateData = {};

    if (name !== undefined) updateData.name = name;

    await category.update({ name });
    res.status(200).json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar categoria.' });
  }
};

//Deletar
exports.delete = async (req, res) => {
  const { id } = req.body;

  try {
    const client_id = Number(req.user.id);

    const category = await Category.findOne({
      where: { id, client_id },
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.destroy();

    res.status(200).json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro interno ao deletar categoria.' });
  }
};
