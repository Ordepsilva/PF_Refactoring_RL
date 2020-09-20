const instance = require('../database/database');

/**
 * @swagger
 * definitions:
 *   Comment:
 *     type: object
 *     properties:
 *         commentary:
 *             type: string
 *     required:
 *         - commentary 
 */
const projModel = instance.model('Comment', {
    commentary: {
        type: 'string',
        required: true,
        primary: true
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
});

module.exports = projModel;
