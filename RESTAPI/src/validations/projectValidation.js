const Joi = require('@hapi/joi');

//funtions to validate the json
const projectCreation = data =>{
    const schema = Joi.object({
        project_name: Joi.string().required(),
        subject: Joi.string().required(),
        description: Joi.string()
    });
    return schema.validate(data);
}

const projectEdit = data =>{
    const schema = Joi.object({
        project_name: Joi.string().required(),
        subject: Joi.string().required(),
        description: Joi.string()
    });
    return schema.validate(data);
}

module.exports.projectCreation = projectCreation;
module.exports.projectEdit = projectEdit;
