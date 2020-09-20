const Joi = require('@hapi/joi');

//funtions to validate the json
const articleCreation = data =>{
    const schema = Joi.object({
        title: Joi.string().required(),
        abstract: Joi.string(),
        doi: Joi.string().regex(/^10.\d{4,9}[^\s]+$/i),
        year: Joi.number().integer().min(1900).max(2020),
        author:Joi.string(),
        citation_key: Joi.string(),
        edition: Joi.string(),
        isbn: Joi.string().regex(/((978[\--– ])?[0-9][0-9\--– ]{10}[\--– ][0-9xX])|((978)?[0-9]{9}[0-9Xx])/),
        tags:Joi.string()
    });
    return schema.validate(data);
}

const editArticleValidation = data =>{
    const schema = Joi.object({
        title: Joi.string().required(),
        abstract: Joi.string(),
        year: Joi.number().integer().max(2020),
        author:Joi.string(),
        citation_key: Joi.string(),
        edition: Joi.string(),
        tags:Joi.string(),
        doi: Joi.string().regex(/^10.\d{4,9}[^\s]+$/i),
        isbn: Joi.string().regex(/((978[\--– ])?[0-9][0-9\--– ]{10}[\--– ][0-9xX])|((978)?[0-9]{9}[0-9Xx])/),
    });
    return schema.validate(data);
}
const commentCreation = data =>{
    const schema = Joi.object({
        commentary: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports.articleCreation = articleCreation;
module.exports.commentCreation = commentCreation;
module.exports.editArticleValidation = editArticleValidation;


