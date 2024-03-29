const Joi = require('@hapi/joi');

//Functions to validate the json
const loginValidation = data =>{
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

const registerValidation = data =>{
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports.loginValitadion = loginValidation;
module.exports.registerValidation = registerValidation;