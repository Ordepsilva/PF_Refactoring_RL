const instance = require('../database/database');
const Project = require('../models/Project');
const Article = require('../models/Article');
const { articleCreation } = require('../validations/articleValidation')
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
            const articleID = await articleCreated.get('articleID');
            const queryToCreateRelation = "MATCH (a:Projeto),(b:Article)  WHERE a.project_id ='" + req.params.project_id + "' and b.articleID = '" + articleID + "' CREATE (a)-[x:OWN]->(b)";
            instance.writeCypher(queryToCreateRelation);
            const article = articleCreated.properties();
            console.log(article);
            return res.status(200).json({ sucess: "Article created successfully", article })
        }
    } catch (err) {
        return res.json(err);
    }
}

articleController.relateArticlesByID = async (req, res) => {

}

articleController.getArticleInfoByID = async (req, res) => {
    const query = "MATCH (n:Article) WHERE n.articleID='" + req.params.articleID + "'RETURN n";
    try {
        instance.readCypher(query).then(result => {
            article = result.records[0]._fields[0].properties;
            console.log(JSON.stringify(article));
            res.send(article);
        })
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

articleController.getArticlesFromProject = async (req, res) => {

}


module.exports = articleController;