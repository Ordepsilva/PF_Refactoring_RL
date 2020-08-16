const Joi = require('@hapi/joi');

//funtions to validate the json
const articleCreation = data =>{
    const schema = Joi.object({
        title: Joi.string().required(),
        abstract: Joi.string(),
        doi: Joi.string(),
        year: Joi.number().integer().max(2020),
        author:Joi.string(),
        citation_key: Joi.string(),
        edition: Joi.string(),
        isbn: Joi.string(),
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
        doi: Joi.string(),
        isbn: Joi.string(),
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


