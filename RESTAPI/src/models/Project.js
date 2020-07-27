const instance = require('../database/database');

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
