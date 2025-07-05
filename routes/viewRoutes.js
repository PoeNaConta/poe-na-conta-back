const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /balanceTotal:
 *   get:
 *     summary: Obter saldo total do usuário
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo total calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   format: decimal
 *                   example: 1250.75
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Rota para buscar o resumo de saldo dos clientes
router.get('/balanceTotal', auth, viewController.getBalanceTotal);

/**
 * @swagger
 * /balanceGains:
 *   get:
 *     summary: Obter total de ganhos do usuário
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total de ganhos calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gains:
 *                   type: number
 *                   format: decimal
 *                   example: 3500.00
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balanceGains', auth, viewController.getBalanceGains);

/**
 * @swagger
 * /balanceDebts:
 *   get:
 *     summary: Obter total de dívidas do usuário
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total de dívidas calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 debts:
 *                   type: number
 *                   format: decimal
 *                   example: 850.25
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balanceDebts', auth, viewController.getBalanceDebts);

/**
 * @swagger
 * /balanceCategories:
 *   get:
 *     summary: Obter saldo agrupado por categorias
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo por categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoryName:
 *                     type: string
 *                     example: Alimentação
 *                   categoryType:
 *                     type: string
 *                     enum: [entrada, saida, divida, ganho]
 *                     example: saida
 *                   total:
 *                     type: number
 *                     format: decimal
 *                     example: 450.75
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balanceCategories', auth, viewController.getBalanceCategories);

/**
 * @swagger
 * /balanceAllDebts:
 *   get:
 *     summary: Obter detalhes de todas as dívidas
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista detalhada de todas as dívidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDebts:
 *                   type: number
 *                   format: decimal
 *                   example: 850.25
 *                 debts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balanceAllDebts', auth, viewController.getBalanceAllDebts);

/**
 * @swagger
 * /balanceAllGains:
 *   get:
 *     summary: Obter detalhes de todos os ganhos
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista detalhada de todos os ganhos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGains:
 *                   type: number
 *                   format: decimal
 *                   example: 3500.00
 *                 gains:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/balanceAllGains', auth, viewController.getBalanceAllGains);

module.exports = router;
