const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authorize');

const articleController = require("../controllers/articleController");

router.post('/createArticle/:project_id', authorized(), articleController.createArticle);

router.get('/getArticleInfoByID/:articleID', authorized(), articleController.getArticleInfoByID);

router.post('/relateArticlesByID/:articleID', authorized(), articleController.relateArticlesByID);

router.get('/getArticlesFromProjectID/:project_id', authorized(), articleController.getArticlesFromProjectID);

router.post('/addComentToArticleByID/:articleID', authorized(), articleController.addComentToArticleByID);

router.put('/editArticle/:articleID', authorized(), articleController.editArticle);

router.delete('/deleteArticle/:articleID', authorized(), articleController.deleteArticle);

router.post('relateOneToMany/:articleID', authorized(), articleController.relateOneToMany);

module.exports = router;
