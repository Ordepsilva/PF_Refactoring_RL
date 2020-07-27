const instance = require('../database/database');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { articleCreation, commentCreation } = require('../validations/articleValidation');
const articleController = {};

/** 
articleController.createArticle = async (req, res) => {
    
    console.log(req.body);
    let objArticle = {};
    objArticle.info = req.body;

    const queryCreateArticle = "CREATE (n:Article $info) RETURN n";

    try {
        const project = await Project.find(req.params.project_id);

        if (project) {
            instance.writeCypher(queryCreateArticle, objArticle).then(result => {
                if (result) {

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
    const project_id = req.params.project_id;

    const { error } = articleCreation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const articleCreated = await Article.create(req.body);
        const projectToConnect = await Project.find(project_id);

        if (articleCreated && projectToConnect) {
            let article = {};
            const articleID = articleCreated.identity().low;
            const queryToCreateRelation = "MATCH (a:Projeto),(b:Article)  WHERE a.project_id ='" + project_id + "' and ID(b) = " + articleID + " CREATE (a)-[x:OWN]->(b)";

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
            article = result.records[0]._fields[0].properties;
            article.articleID = result.records[0]._fields[0].identity.low;
            return res.status(200).json(article);
        })
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

articleController.getArticlesFromProjectID = async (req, res) => {
    const projectID = req.params.project_id;
    const queryGetAllArticles = "MATCH (a)-[x:OWN]->(b) WHERE ID(a) = " + projectID + " Return (b)";

    try {
        instance.readCypher(queryGetAllArticles).then(result => {
            if (result) {
                let articles = [];

                for (let i = 0; i < result.records.length; i++) {
                    let article = {};
                    article = result.records[i]._fields[0].properties;
                    article.articleID = result.records[i]._fields[0].identity.low;
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

articleController.addCommentToArticleByID = async (req, res) => {
    const articleID = req.params.articleID;

    const { error } = commentCreation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const commentCreated = await Comment.create(req.body);
        if (commentCreated) {
            let comment = {};
            const commentID = commentCreated.identity().low;
            const queryAddCommentToArticle = "MATCH (a:Article),(b:Comment) WHERE ID(a)=" + articleID + " and ID(b)=" + commentID + " CREATE (a)-[x:HAS_COMMENTARY]->(b)";
            instance.writeCypher(queryAddCommentToArticle);
            comment.commentID = commentID;
            comment = commentCreated.properties();
            return res.status(200).json({ sucess: "Comment Created", comment });
        }
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.deleteArticle = async (req, res) => {
    const articleID = req.params.articleID;
    try {
        articleTodelete = await Article.findById(articleID);
        if (articleTodelete) {
            await articleTodelete.delete();
            return res.status(200).json({ result: "Article was deleted!" });
        } else {
            return res.status(400).send("Problem occurred while deleting");
        }
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

articleController.relateOneToMany = async (req, res) => {

}

articleController.getConfigForRunNeoVis = async (req, res) => {
    const config = {
        container_id: "viz",
        server_url: req.body.server_url,
        server_user: req.body.user,
        server_password: req.body.password,
        labels: {
            "Article": {
                "caption": "title",
            },
            "Projeto": {
                "caption": "project_name",
                "title_properties": [
                    "project_name",
                    "createdAt",
                    "description",
                    "subject"
                ]
            },
        }
    };

}

articleController.getCommentsFromArticleID = async (req, res) => {
    const articleID = req.params.articleID;
    const queryGetComments = "MATCH (a:Article)-[x:HAS_COMMENTARY]->(b:Comment) WHERE ID(a)=" + articleID + " RETURN b";

    try {
        instance.readCypher(queryGetComments).then(result => {
            if (result) {
                let comments = [];
                for (let i = 0; i < result.records.length; i++) {
                    let comment = {};
                    comment = result.records[i]._fields[0].properties;
                    comment.commentID = result.records[i]._fields[0].identity.low;
                    comments.push(comment);
                }
                return res.status(200).json(comments);
            }
        })
    }catch(err){
        console.log(err);
        return res.json(err);
    }
}

articleController.editArticle = async (req, res) => {

}


module.exports = articleController;