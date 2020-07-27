const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authorize');

const articleController = require("../controllers/articleController");

router.post('/createArticle/:project_id', authorized(), articleController.createArticle);

router.post('/relateArticlesByID/:articleID', authorized(), articleController.relateArticlesByID);

router.post('/addCommentToArticleByID/:articleID', authorized(), articleController.addCommentToArticleByID);

router.post('/relateOneToMany/:articleID', authorized(), articleController.relateOneToMany);

router.get('/getArticleInfoByID/:articleID', authorized(), articleController.getArticleInfoByID);

router.get('/getArticlesFromProjectID/:project_id', authorized(), articleController.getArticlesFromProjectID);

router.get('/getCommentsFromArticleID/:articleID', authorized(), articleController.getCommentsFromArticleID);

router.put('/editArticle/:articleID', authorized(), articleController.editArticle);

router.delete('/deleteArticle/:articleID', authorized(), articleController.deleteArticle);




module.exports = router;
