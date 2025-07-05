const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: minhasenha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /users - Criar um novo usuário com verificação de e-mail
router.post('/users', userController.createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /login - Login de usuário
router.post('/login', userController.login);

/**
 * @swagger
 * /users/forgot-pass:
 *   post:
 *     summary: Solicitar alteração de senha
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /users/forgot-pass - Solicita alteração da senha
router.post('/users/forgot-pass', userController.forgotPass);

/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Validar email cadastrado
 *     tags: [Autenticação]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de verificação de email
 *     responses:
 *       200:
 *         description: Email verificado com sucesso
 *       400:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /verify-email - Valida o email cadastrado
router.get('/verify-email', userController.email);

/**
 * @swagger
 * /users/verify-email:
 *   get:
 *     summary: Verificar email
 *     tags: [Autenticação]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de verificação
 *     responses:
 *       200:
 *         description: Email verificado
 *       400:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /users/verify-email - Verifica o email
router.get('/users/verify-email', userController.verifyEmail);

/**
 * @swagger
 * /users/reset-pass:
 *   patch:
 *     summary: Alterar senha
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de recuperação de senha
 *               newPassword:
 *                 type: string
 *                 example: novasenha123
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Token inválido ou dados incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// UPDATE /users/reset-pass - Ateração da senha
router.patch('/users/reset-pass', userController.resetPassword);

//****// Rotas protegidas //****//

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /users/me - Retornar os dados do usuário
router.get('/users/me', auth, userController.searchUser);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Remover usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /users/me - Remover o usuário
router.delete('/users/me', auth, userController.delete);

/**
 * @swagger
 * /users/update-name:
 *   patch:
 *     summary: Atualizar nome do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Santos
 *     responses:
 *       200:
 *         description: Nome atualizado com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// UPDATE /users/update-name - Atualiza nome do usuário
router.patch('/users/update-name', auth, userController.updateName);

/**
 * @swagger
 * /users/update-password:
 *   patch:
 *     summary: Atualizar senha do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: senhaatual123
 *               newPassword:
 *                 type: string
 *                 example: novasenha123
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       401:
 *         description: Token inválido ou senha atual incorreta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// UPDATE /users/update-password - Atualiza senha do usuário
router.patch('/users/update-password', auth, userController.updPass);

/**
 * @swagger
 * /users/update-email:
 *   patch:
 *     summary: Solicitar alteração de email
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 example: novoemail@email.com
 *     responses:
 *       200:
 *         description: Email de confirmação enviado
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// UPDATE /users/update-email - Alteração do email
router.patch('/users/update-email', auth, userController.requestEmailUpdate);

module.exports = router;
