const express = require('express');
const router = express.Router();
const {authorized}  =require('../middlewares/authorize');

const projController = require("../controllers/projectController");

/*Rota responsável por efetuar o login*/
router.post('/create_project',authorized(), projController.createProject);

router.get('/getProjectsByUser', authorized(), projController.getProjectsForUser);
module.exports = router;