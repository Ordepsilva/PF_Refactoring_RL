const instance = require('../database/database');

const userModel = instance.model('Utilizadores', {
    username: {
        type: 'name',
        unique: true,
        primary: true,
        required: true 
    },
    id: {
        type: 'uuid',
        unique: true,
        required: true
    },
    password: {
        type: 'String',
        required: true
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
});

module.exports = userModel;

