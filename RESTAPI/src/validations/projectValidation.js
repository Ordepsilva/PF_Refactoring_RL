const Joi = require('@hapi/joi');

//Validate Login

const projectCreation = data =>{
    const schema = Joi.object({
        project_name: Joi.string().required(),
        subject: Joi.string().required(),
        description: Joi.string()
    });

    return schema.validate(data);
}


module.exports.projectCreation = projectCreation;
