const instance = require('../database/database');

const userModel = instance.model('User', {
    username: {
        type: 'name',
        unique: true,
        primary: true,
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

