const instance = require('../database/database');
/**
 * Project Model
 */
const projModel = instance.model('Projeto', {
    project_name: {
        type: 'name',
        unique: true,
        primary: true,
        required: true // Creates a Unique Constraint
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
        required: true
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
});

module.exports = projModel;
