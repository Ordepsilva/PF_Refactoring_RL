const instance = require('../database/database');

const projModel = instance.model('Projeto', {
    project_name: {
        type: 'name',
        unique: true,
        required: true 
    },
    description: {
        type: 'string',
    },

    subject: {
        type:'string',
        required:true
    }
    ,
    project_id: {
        type: 'uuid',
        unique: true,
        primary:true,
        required: true
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
});

module.exports = projModel;
