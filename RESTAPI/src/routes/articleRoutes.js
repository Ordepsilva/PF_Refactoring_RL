const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authorize');

const articleController = require("../controllers/articleController");

router.post('/createArticle/:project_id', authorized(), articleController.createArticle);

router.get('/getArticleInfoByID/:articleID', authorized(), articleController.getArticleInfoByID);

module.exports = router;               
