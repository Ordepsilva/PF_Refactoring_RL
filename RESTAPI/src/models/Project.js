const instance = require('../database/database');

/**
 * @swagger
 * definitions:
 *   Project:
 *     type: object
 *     properties:
 *         project_name:
 *              type: string
 *         description:
 *              type: string
 *         subject:
 *              type: string
 *     required:
 *         - project_name
 *         - subject     
 */
const projModel = instance.model('Project', {
    project_name: {
        type: 'name',
        unique: true,
        required: true,
        primary:true
    },
    description: {
        type: 'string',
    },
    subject: {
        type: 'string',
        required: true
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
});

module.exports = projModel;
