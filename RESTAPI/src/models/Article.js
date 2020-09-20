const instance = require('../database/database');

/**
 * @swagger
 * definitions:
 *   Article:
 *     type: object
 *     properties:
 *         title:
 *              type: string
 *         abstract:
 *              type: string
 *         doi:
 *              type: string
 *         isbn:
 *              type: string
 *         year:
 *              type: string
 *         tags:
 *              type: string
 *         author:
 *              type: string
 *         citation_key:
 *              type: string
 *         edition:
 *              type: string
 *     required:
 *         - title    
 */
const articleModel = instance.model('Article', {
    title: {
        type: 'name',
        unique: true,
        required: true
    },
    abstract: {
        type: 'string',
    },
    doi: {
        type: 'string',
        unique: true,
    },
    isbn: {
        type: 'string',
        unique: true
    },
    year: {
        type: 'Date'
    },
    tags:{
        type:'string'
    },
    author:{
        type:'string'
    },
    citation_key:{
        type:'string'
    },
    edition:{
        type:'string'
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
});

module.exports = articleModel;
