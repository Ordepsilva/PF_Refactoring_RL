const express = require('express');
const router = express.Router();

const mendeleyController = require("../controllers/mendeleyController");

router.get('/login', mendeleyController.login);

router.post('/token', mendeleyController.token);

router.post('/addArticleToProjectID/:project_id', mendeleyController.createArticleFromMendeley);
module.exports = router;
