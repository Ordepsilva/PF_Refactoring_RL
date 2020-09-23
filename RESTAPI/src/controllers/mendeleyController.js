var request = require('request');
var querystring = require('querystring');
const Article = require('../models/Article');
const Project = require('../models/Project');
const instance = require('../database/database');
const { articleCreation } = require('../validations/articleValidation');
const mendeleyController = {}

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = process.env.redirect_uri;


mendeleyController.login = async (req, res) => {
    let state = generateRandomString(16);
    let scope = 'all';

    return res.json({
        redirect: 'https://api.mendeley.com/oauth/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            })
    });
}

mendeleyController.token = async (req, res) => {
    let code = req.body.code;
    let access_token;

    let authOptions = {
        url: 'https://api.mendeley.com/oauth/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code',
            client_id: client_id,
            client_secret: client_secret
        },
        json: true
    };

    request.post(authOptions, async (error, response, body) => {
        access_token = body.access_token;
        if (error) {
            console.log(error);
            return res.status(400).json({ error: error });
        }
        if (access_token) {
            return res.status(200).json({ mendeleyToken: access_token });
        }
    });
}

mendeleyController.createArticleFromMendeley = async (req, res) => {
    let project_id = req.params.project_id;
    let article = req.body;
    let articleToCreate = {};

    articleToCreate.title = article.title;

    if (article.abstract !== undefined) {
        articleToCreate.abstract = article.abstract;
    }
    if (article.identifiers !== undefined) {
        if (article.identifiers.doi !== undefined) {
            articleToCreate.doi = article.identifiers.doi;
        }
        if (article.identifiers.isbn !== undefined) {
            articleToCreate.isbn = article.identifiers.isbn;
        }
    }
    if (article.year !== undefined) {
        articleToCreate.year = article.year;
    }
    if (article.citation_key !== undefined) {
        articleToCreate.citation_key = article.citation_key;
    }
    if (article.edition !== undefined) {
        articleToCreate.edition = article.edition;
    }
    if (article.authors !== undefined) {
        if (article.authors.length > 0) {
            articleToCreate.author ="";
            article.authors.forEach(element => {
                articleToCreate.author += element.first_name + " " + element.last_name + ";"
            });
        }
        console.log(articleToCreate.author);
    }
    if (article.tags !== undefined) {
        if (article.tags.length > 0) {
            articleToCreate.tags ="";
            article.tags.forEach(element => {
                articleToCreate.tags += element + ";";
            })
        }
    }

    const { error } = articleCreation(articleToCreate);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const queryVerifyIfArticleExists = "MATCH (p:Project)-[r:OWN]->(n:Article) WHERE id(p)="+project_id + " and (n.title = '" + articleToCreate.title + "' OR n.doi = '" + articleToCreate.doi + "' OR n.isbn= '" + articleToCreate.isbn + "') RETURN n";
    const verifyResult = await instance.readCypher(queryVerifyIfArticleExists);

    if (verifyResult.records.length > 0) {
        return res.status(400).json({ error: "Article already exist" });
    } else {
        const articleCreated = await Article.create(articleToCreate);
        const projectToConnect = await Project.findById(project_id);
        const articleID = articleCreated.identity().low;
       
        if (articleCreated && projectToConnect) {
            let article = {};
            const queryToCreateRelation = "MATCH (a:Project),(b:Article)  WHERE ID(a) =" + project_id + " and ID(b) = " + articleID + " CREATE (a)-[x:OWN]->(b)";
           
            instance.writeCypher(queryToCreateRelation);

            article = articleCreated.properties();
            article.year = articleCreated.get('year').year.low;
            article.articleID = articleID;

            return res.status(200).json({ success: "Article added with success", article: article })
        } else {
            return res.status(400).json({ error: "Error occurred while attempting to add article!" });
        }
    }
}

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

module.exports = mendeleyController;