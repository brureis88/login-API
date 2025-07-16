const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Usuário ou senha inválidos
 *       423:
 *         description: Usuário bloqueado por tentativas inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /solicitar-redefinicao:
 *   post:
 *     summary: Solicita código de redefinição de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/solicitar-redefinicao', authController.solicitarRedefinicao);

/**
 * @swagger
 * /validar-codigo:
 *   post:
 *     summary: Valida o código de redefinição
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               codigo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código válido
 *       400:
 *         description: Código inválido ou expirado
 */
router.post('/validar-codigo', authController.validarCodigo);

/**
 * @swagger
 * /redefinir-senha:
 *   post:
 *     summary: Redefine a senha com código válido
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               codigo:
 *                 type: string
 *               novaSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Código inválido ou não validado
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/redefinir-senha', authController.redefinirSenha);

/**
 * @swagger
 * /esqueci-senha:
 *   post:
 *     summary: Endpoint legado - Solicita redefinição de senha (desbloqueia usuário)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Instruções de redefinição enviadas
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/esqueci-senha', authController.esqueciSenha);

module.exports = router; 