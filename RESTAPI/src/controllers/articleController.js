const instance = require('../database/database');
const Project = require('../models/Project');
const Article = require('../models/Article');
const { articleCreation } = require('../validations/articleValidation');
const { Relationship } = require('neode');
const articleController = {};

/** 
articleController.createArticle = async (req, res) => {
    console.log(req.body);
    let objArticle = {};
    objArticle.info = req.body;

    let article = await Article.create(req.body);
    console.log(article);


    const queryCreateArticle = "CREATE (n:Article $info) RETURN n";

    try {
        const project = await Project.find(req.params.project_id);

        if (project) {
            instance.writeCypher(queryCreateArticle, objArticle).then(result => {
                if (result) {
                    console.log(result.records[0].get(0));
                    let node = result.records[0].get(0);
                    let articleId = node.identity.low;
                    console.log("Id:" + articleId);
                    const queryToCreateRelation = "MATCH (a:Projeto),(b:Article)  WHERE a.project_id ='" + req.params.project_id + "' and ID(b) = " + articleId + " CREATE (a)-[x:OWN]->(b)";

                    instance.writeCypher(queryCreateArticle);
                    return res.status(200).json({ response: "sucess", node });
                }
            })
        }
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}
*/
articleController.createArticle = async (req, res) => {
    const { error } = articleCreation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const articleCreated = await Article.create(req.body);
        console.log(articleCreated);
        const projectToConnect = await Project.find(req.params.project_id);

        if (articleCreated && projectToConnect) {
            let article = {};
            const articleID = articleCreated.identity().low;
            const queryToCreateRelation = "MATCH (a:Projeto),(b:Article)  WHERE a.project_id ='" + req.params.project_id + "' and ID(b) = " + articleID + " CREATE (a)-[x:OWN]->(b)";
            instance.writeCypher(queryToCreateRelation);
            article = articleCreated.properties();
            article.articleID = articleID;
            return res.status(200).json({ sucess: "Article created successfully", article })
        }
    } catch (err) {
        return res.json(err);
    }
}

articleController.relateArticlesByID = async (req, res) => {

    const articleID = req.params.articleID;
    const articleToRelateID = req.body.articleID;
    const relationName = req.body.relationName;
    const queryToRelate = "MATCH (a:Article),(b:Article) WHERE ID(a)=" + articleID + " and ID(b)=" + articleToRelateID + " CREATE (a)-[x:" + relationName + "]->(b) RETURN x";

    try {
        const findRelationName = await Relationship.find(relationName);

        if (!findRelationName) {
            try {
                const createNewRelation = Relationship.create(relationName);
            } catch (err) {
                console.log(err);
            }
        }

        instance.writeCypher(queryToRelate).then(result => {
            if (result) {
                console.log(result);
                return res.status(200).json({ sucess: "Relation created" });
            }
        });

    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.getArticleInfoByID = async (req, res) => {

    const query = "MATCH (b:Article) WHERE ID(b)=" + req.params.articleID + " RETURN b";
    try {
        instance.readCypher(query).then(result => {
            let article = {};
            console.log(result.records[0]._fields);
            article = result.records[0]._fields[0].properties;
            article.articleID = result.records[0]._fields[0].identity.low;
            console.log(JSON.stringify(article));
            return res.status(200).json(article);
        })
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

articleController.getArticlesFromProjectID = async (req, res) => {
    const projectID = req.params.project_id;
    const queryGetAllArticles = "MATCH (a)-[x:OWN]->(b) WHERE a.project_id = '" + projectID + "' Return (b)";

    try {
        instance.readCypher(queryGetAllArticles).then(result => {
            if (result) {
                let articles = [];

                for (let i = 0; i < result.records.length; i++) {
                    let article = {};
                    article.articleID = result.records[i]._fields[0].identity.low;
                    article = result.records[i]._fields[0].properties;
                    articles.push(article);
                }

                return res.status(200).json(articles);
            }
        })
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

module.exports = articleController;