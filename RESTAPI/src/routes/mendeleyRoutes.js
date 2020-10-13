const express = require('express');
const router = express.Router();

const mendeleyController = require("../controllers/mendeleyController");

/**
 * @swagger
 * /mendeley/login:
 *  post:
 *    tags: 
 *        - Mendeley
 *    name: Login
 *    summary: Authenticate in mendeley
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    responses:
 *      '200':
 *        description: A redirect to the Mendeley page
 */
router.get('/login', mendeleyController.login);

/**
 * @swagger
 * /mendeley/token:
 *  post:
 *    tags: 
 *        - Mendeley
 *    name: Token
 *    summary: Get mendeley token
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: body
 *        in: body
 *        properties:
 *            code:
 *              type: string
 *        required:
 *              - code
 *    responses:
 *      '200':
 *        description: A successful response with token
 */
router.post('/token', mendeleyController.token);

/**
 * @swagger
 * /mendeley/addArticleToProjectID/{project_id}:
 *  post:
 *    tags: 
 *        - Mendeley
 *    name: Mendeley
 *    summary: Import article to project by ID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: project_id
 *        project_id: 
 *          type: number
 *        in: path
 *        required:
 *              - project_id
 *      - name: body
 *        in: body
 *        properties:
 *               title:
 *                  type: string
 *               abstract:
 *                  type: string
 *               doi:
 *                  type: string
 *               isbn:
 *                  type: string
 *               year:
 *                  type: string
 *               tags:
 *                  type: string
 *               author:
 *                  type: string
 *               citation_key:
 *                  type: string
 *               edition:
 *                  type: string
 *        required:
 *               - title
 *    responses:
 *      '200':
 *        description: Article added to the project
 */
router.post('/addArticleToProjectID/:project_id', mendeleyController.createArticleFromMendeley);

module.exports = router;
