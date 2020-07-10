const instance = require('../database/database');

const articleModel = instance.model('Article', {
    title: {
        type: 'name',
        unique: true,
        required: true
    },
    abstract: {
        type: 'string',
    },
    articleID: {
        type: 'uuid',
        required: true,
        primary: 'true'
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
