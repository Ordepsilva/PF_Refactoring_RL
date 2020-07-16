const instance = require('../database/database');

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
