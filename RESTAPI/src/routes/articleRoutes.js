const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authorize');
const articleController = require("../controllers/articleController");

/**
 * @swagger
 * /articles/createArticle/{project_id}:
 *  post:
 *    tags: 
 *        - Articles
 *    name: Create new Article
 *    summary: Create a new article and add it to a existing project
 *    description:  Only Title is required, if you don't want to add some statment just remove it from the json object
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
 *        description: Success response with the article created
 *      '400':
 *        description: Article already exist
 */
router.post('/createArticle/:project_id', authorized(), articleController.createArticle);

/**
 * @swagger
 * /articles/relateArticlesByID/{project_id}:
 *  post:
 *    tags: 
 *        - Articles
 *    name: Relate Articles By ID
 *    summary: Relate two articles by ID
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
 *               articleID:
 *                  type: number
 *               articleToRelateID:
 *                  type: number
 *               relationName:
 *                  type: string
 *        required:
 *              - articleID
 *              - articleToRelateID
 *              - relationName
 *    responses:
 *      '200':
 *        description: Success response with the article created
 *      '400':
 *        description: Article already exist
 */
router.post('/relateArticlesByID/:project_id', authorized(), articleController.relateArticlesByID);

/**
 * @swagger
 * /articles/addCommentToArticleByID/{articleID}:
 *  post:
 *    tags: 
 *        - Articles
 *    name: Add Coment To Article
 *    summary: Add Comment to article by ID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
 *      - name: body
 *        in: body
 *        properties:
 *             commentary:
 *                  type: string             
 *        required:
 *              - commentary
 *    responses:
 *      '200':
 *        description: Success response with the article created
 *      '400':
 *        description: Article already exist
 */
router.post('/addCommentToArticleByID/:articleID', authorized(), articleController.addCommentToArticleByID);

/**
 * @swagger
 * /articles/relateOneToMany/{project_id}:
 *  post:
 *    tags: 
 *        - Articles
 *    name: Relate one article to many
 *    summary: Relate one article to many
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
 *              articleID:
 *                  type: number
 *              articles:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          articleID:
 *                              type: number
 *              relationName:
 *                  type: string          
 *        required:
 *              - articleID
 *              - articles
 *              - relationName
 *    responses:
 *      '200':
 *        description: Articles Related with success
 */
router.post('/relateOneToMany/:project_id', authorized(), articleController.relateOneToMany);


/**
 * @swagger
 * /articles/removeRelationBetweenArticles/{articleID}:
 *  post:
 *    tags: 
 *        - Articles
 *    name: Remove relation
 *    summary: Remove one relation between two articles
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
 *      - name: body
 *        in: body
 *        properties:
 *              articleID:
 *                  type: number
 *              relationName:
 *                  type: string      
 *        required:
 *              - articleID
 *              - relationName
 *    responses:
 *      '200':
 *        description: Relation removed
 */
router.post('/removeRelationBetweenArticles/:articleID', authorized(), articleController.removeRelationBetweenArticles);

/**
 * @swagger
 * /articles/getConfigForRunNeoVis/{project_id}:
 *  post:
 *    tags: 
 *        - Articles
 *    name: Get config Neovis
 *    summary: Get config to run Neovis for one project
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
 *              server_url:
 *                  type: string
 *              user:
 *                  type: string      
 *              password:
 *                  type: string
 *        required:
 *              - server_url
 *              - user
 *              - password
 *    responses:
 *      '200':
 *        description: Object with config for NeoVis
 */
router.post('/getConfigForRunNeoVis/:project_id', authorized(), articleController.getConfigForRunNeoVis);

/**
 * @swagger
 * /articles/getConfigForArticleID/{articleID}:
 *  post:
 *    tags: 
 *        - Articles
 *    name: Config to run Neovis
 *    summary: Get config to run Neovis for one article
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
 *      - name: body
 *        in: body
 *        properties:
 *              server_url:
 *                  type: string
 *              user:
 *                  type: string      
 *              password:
 *                  type: string
 *        required:
 *              - server_url
 *              - user
 *              - password
 *    responses:
 *      '200':
 *        description: Object with config for NeoVis
 */
router.post('/getConfigForArticleID/:articleID',authorized(), articleController.getConfigForArticleID);

/**
 * @swagger
 * /articles/getArticleInfoByID/{articleID}:
 *  get:
 *    tags: 
 *        - Articles
 *    name: Get Article Info By ID
 *    summary: Get article info by ID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
 *    responses:
 *      '200':
 *        description: Object response with article 
 *      '400':
 *        description: Article doesn't exist 
 */
router.get('/getArticleInfoByID/:articleID', authorized(), articleController.getArticleInfoByID);

/**
 * @swagger
 * /articles/getRelationsForProjectID/{project_id}:
 *  get:
 *    tags: 
 *        - Articles
 *    name: Get Relations for project_id
 *    summary: Get all the existing relations in one project
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
 *    responses:
 *      '200':
 *        description: Object response with all the relations in one project  
 *      '400':
 *        description: Project doesn't exist 
 */
router.get('/getRelationsForProjectID/:project_id', authorized(), articleController.getRelationsForProjectID);


/**
 * @swagger
 * /articles/getArticlesRelatedToArticleID/{articleID}:
 *  get:
 *    tags: 
 *        - Articles
 *    name: Get articles related
 *    summary: Get all articles related to one articleID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
 *    responses:
 *      '200':
 *        description: Array response with all articles related to articleID 
 *      '400':
 *        description: Article doesn't exist 
 */
router.get('/getArticlesRelatedToArticleID/:articleID', authorized(), articleController.getArticlesRelatedToArticleID);


/**
 * @swagger
 * /articles/getArticlesFromProjectID/{project_id}:
 *  get:
 *    tags: 
 *        - Articles
 *    name: Get articles from projectID
 *    summary: Get all articles for one project
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
 *    responses:
 *      '200':
 *        description: Array response with all articles
 *      '400':
 *        description: Article doesn't exist 
 */
router.get('/getArticlesFromProjectID/:project_id', authorized(), articleController.getArticlesFromProjectID);

/**
 * @swagger
 * /articles/getCommentsFromArticleID/{articleID}:
 *  get:
 *    tags: 
 *        - Articles
 *    name: Get all comments
 *    summary: Get all comments for articleID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
 *    responses:
 *      '200':
 *        description: Array response with all the comments
 *      '400':
 *        description: Article doesn't exist 
 */
router.get('/getCommentsFromArticleID/:articleID', authorized(), articleController.getCommentsFromArticleID);

/**
 * @swagger
 * /articles/editArticle/{articleID}:
 *  put:
 *    tags: 
 *        - Articles
 *    name: Edit one article
 *    summary: Edit article by ID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
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
 *        description: Success response article updated
 *      '400':
 *        description: Restrictions errors in the input statments
 *      '401':
 *        description: Error trying to edit article!
 */
router.put('/editArticle/:articleID', authorized(), articleController.editArticle);

/**
 * @swagger
 * /articles/{articleID}:
 *  delete:
 *    tags: 
 *        - Articles
 *    name: Delete one article
 *    summary: Delete article by ID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: articleID
 *        articleID: 
 *          type: number
 *        in: path
 *        required:
 *              - articleID
 *    responses:
 *      '200':
 *        description: Article was deleted
 *      '400':
 *        description: Problem occurred while deleting
 */
router.delete('/:articleID', authorized(), articleController.deleteArticle);

/**
 * @swagger
 * /articles/deleteComment/{commentID}:
 *  delete:
 *    tags: 
 *        - Articles
 *    name: Delete one comment by ID
 *    summary: Delete comment by ID
 *    security:
 *      - bearerAuth: []
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: commentID
 *        commentID: 
 *          type: number
 *        in: path
 *        required:
 *              - commentID
 *    responses:
 *      '200':
 *        description: Comment was deleted!
 *      '400':
 *        description: Problem occurred while deleting
 */
router.delete('/deleteComment/:commentID', authorized(), articleController.deleteCommentFromArticleID);

module.exports = router;
