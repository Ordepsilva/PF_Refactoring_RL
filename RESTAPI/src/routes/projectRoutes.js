const express = require('express');
const router = express.Router();
const { authorized } = require('../middlewares/authorize');
const articleRoutes = require('./articleRoutes');
const projController = require("../controllers/projectController");

/**
 * @swagger
 * /project/create_project:
 *  post:
 *    tags: 
 *        - Projects
 *    name: Create Project
 *    summary: Create new project
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
 *            project_name:
 *              type: string
 *            description:
 *              type: string
 *            subject:
 *              type: string
 *        required:
 *              - project_name
 *              - subject
 *    responses:
 *      '200':
 *        description: Success response with the project created
 *      '400':
 *        description: Project name already exists.
 */
router.post('/create_project', authorized(), projController.createProject);


/**
* @swagger
* /project/getProjectsByUser:
*   get:
*     tags:
*       - Projects
*     name: GetProjectsByUser
*     summary: Get projects all projects for user
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     responses:
*       200:
*         description: All the projects for user
*/
router.get('/getProjectsByUser', authorized(), projController.getProjectsForUser);

/**
 * @swagger
 * /project/editProject/{project_id}:
 *   put:
 *     tags: 
 *         - Projects
 *     name: EditProject
 *     summary: Updates a single project by id
 *     security:
 *      - bearerAuth: []
 *     description: Updates a single project
 *     produces: application/json
 *     parameters:
 *      - name: project_id
 *        project_id: 
 *          type: number
 *        in: path
 *        required:
 *              - project_id
 *      - name: body
 *        in: body
 *        properties:
 *          project_name: 
 *              type: string
 *          description:
 *              type: string
 *          subject:
 *              type: string
 *        required:
 *              - project_name
 *              - subject
 *     responses:
 *       200:
 *         description: Success message
 *       400:
 *         description: Error while attemption to update
 */
router.put('/editProject/:project_id', authorized(), projController.editProject);

/**
 * @swagger
 * /project/{project_id}:
 *   delete:
 *     tags: 
 *         - Projects
 *     name: DeleteProject
 *     summary: Delete project by id
 *     security:
 *      - bearerAuth: []
 *     description: Delete a single project
 *     produces: application/json
 *     parameters:
 *      - name: project_id
 *        project_id: 
 *          type: number
 *        in: path
 *        required:
 *              - project_id
 *     responses:
 *       200:
 *         description: Success message
 *       400:
 *         description: Error while attemption to update
 */
router.delete('/:project_id', authorized(), projController.deleteProject);

/**
* @swagger
* /project/getProjectById/{project_id}:
*   get:
*     tags:
*       - Projects
*     name: getProjectById
*     summary: Get all the information about one project
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     description: Get all the information about one project
*     parameters:
*      - name: project_id
*        project_id: 
*          type: number
*        in: path
*        required:
*              - project_id
*     responses:
*       200:
*         description: Response with the project
*/
router.get('/getProjectById/:project_id', authorized(), projController.getProjectInfoById);

module.exports = router;               