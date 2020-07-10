const express = require('express');
const router = express.Router();
const {authorized}  =require('../middlewares/authorize');
const articleRoutes = require('./articleRoutes');
const projController = require("../controllers/projectController");

router.post('/create_project',authorized(), projController.createProject);

router.get('/getProjectsByUser', authorized(), projController.getProjectsForUser);

router.put('/editProject/:project_id', authorized(), projController.editProject);

router.delete('/:project_id', authorized(), projController.deleteProject);

router.get('/getProjectById/:project_id', authorized(), projController.getProjectInfoById);

router.use('/articles', articleRoutes);

module.exports = router;               