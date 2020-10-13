const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authorize');
const userController = require("../controllers/userController");


/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags: 
 *        - Users
 *    name: Login
 *    summary: Authenticate a user
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: body
 *        in: body
 *        properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *              format: password
 *        required:
 *              - username
 *              - password
 *    responses:
 *      '200':
 *        description: A successful response with token
 *      '400':
 *        description: Username or password don't exists
 *      '401':
 *        description: Invalid Password
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /auth/register:
 *  post:
 *    tags: 
 *        - Users
 *    name: Register
 *    summary: Register a new user
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: body
 *        in: body
 *        properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *              format: password
 *        required:
 *              - username
 *              - password
 *    responses:
 *      '200':
 *        description: A successful response with token
 *      '400':
 *        description: Username already in use
 */
router.post('/register', userController.register);

/**
* @swagger
* /auth/getUserInfo:
*   get:
*     tags:
*       - Users
*     name: GetUserInfo
*     summary: Get the authenticated user info
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     responses:
*       200:
*         description: User info
*       401:
*         description: Not authenticated!
*/
router.get('/getUserInfo', authorized(), userController.getUserInfo);

module.exports = router;