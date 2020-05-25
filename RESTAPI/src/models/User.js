const instance = require('../database/database');
/**
 * User model
 */
const userModel = instance.model('User', {
    username: {
        type: 'name',
        unique: true,
        primary: true,
        required: true // Creates a Unique Constraint
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

