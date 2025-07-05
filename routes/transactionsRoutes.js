const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /transactions/create:
 *   post:
 *     summary: Criar uma nova transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - value
 *               - type
 *               - categoryId
 *             properties:
 *               description:
 *                 type: string
 *                 example: Compra no supermercado
 *               value:
 *                 type: number
 *                 format: decimal
 *                 example: 150.50
 *               type:
 *                 type: string
 *                 enum: [entrada, saida, divida, ganho]
 *                 example: saida
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /transactions/create - Criar uma nova transação
router.post('/transactions/create', auth, transactionsController.create);

/**
 * @swagger
 * /transactions/list-all-transactions:
 *   get:
 *     summary: Listar todas as transações do usuário
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite de itens por página
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [entrada, saida, divida, ganho]
 *         description: Filtrar por tipo de transação
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /transactions/list-all-transactions - Lista todas as transações
router.get(
  '/transactions/list-all-transactions',
  auth,
  transactionsController.listAll,
);

/**
 * @swagger
 * /transactions/update:
 *   patch:
 *     summary: Atualizar uma transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: Compra no supermercado atualizada
 *               value:
 *                 type: number
 *                 format: decimal
 *                 example: 175.00
 *               type:
 *                 type: string
 *                 enum: [entrada, saida, divida, ganho]
 *                 example: saida
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PUT /transactions/update - Atualização de transação
router.patch('/transactions/update', auth, transactionsController.update);

/**
 * @swagger
 * /transactions/delete:
 *   delete:
 *     summary: Deletar uma transação específica
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Transação deletada com sucesso
 *       400:
 *         description: ID da transação é obrigatório
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /transactions/delete - Deletar transação específica
router.delete('/transactions/delete', auth, transactionsController.delete);

module.exports = router;
