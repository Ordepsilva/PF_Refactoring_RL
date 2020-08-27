const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authorize');
const articleController = require("../controllers/articleController");

router.post('/createArticle/:project_id', authorized(), articleController.createArticle);

router.post('/relateArticlesByID/:project_id', authorized(), articleController.relateArticlesByID);

router.post('/addCommentToArticleByID/:articleID', authorized(), articleController.addCommentToArticleByID);

router.post('/relateOneToMany/:project_id', authorized(), articleController.relateOneToMany);

router.post('/removeRelationBetweenArticles/:articleID', authorized(), articleController.removeRelationBetweenArticles);

router.post('/getConfigForRunNeoVis/:project_id', authorized(), articleController.getConfigForRunNeoVis);

router.post('/getConfigForArticleID/:articleID',authorized(), articleController.getConfigForArticleID);

router.get('/getArticleInfoByID/:articleID', authorized(), articleController.getArticleInfoByID);

router.get('/getRelationsForProjectID/:project_id', authorized(), articleController.getRelationsForProjectID);

router.get('/getArticlesRelatedToArticleID/:articleID', authorized(), articleController.getArticlesRelatedToArticleID);

router.get('/getArticlesFromProjectID/:project_id', authorized(), articleController.getArticlesFromProjectID);

router.get('/getCommentsFromArticleID/:articleID', authorized(), articleController.getCommentsFromArticleID);

router.put('/editArticle/:articleID', authorized(), articleController.editArticle);

router.delete('/:articleID', authorized(), articleController.deleteArticle);

router.delete('/deleteComment/:commentID', authorized(), articleController.deleteCommentFromArticleID);

module.exports = router;
