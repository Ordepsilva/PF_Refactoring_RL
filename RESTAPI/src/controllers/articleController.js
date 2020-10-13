const instance = require('../database/database');
const Project = require('../models/Project');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const fs = require('fs').promises;
const { articleCreation, commentCreation, editArticleValidation } = require('../validations/articleValidation');
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
    const title = req.body.title;
    const doi = req.body.doi;
    const isbn = req.body.isbn;
    const queryVerifyIfArticleExists = "MATCH (p:Project)-[r:OWN]->(n:Article) WHERE id(p)=" + project_id + " and (n.title ='" + title + "' OR n.doi = '" + doi + "' OR n.isbn= '" + isbn + "') RETURN n";

    const { error } = articleCreation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const verifyResult = await instance.readCypher(queryVerifyIfArticleExists);

    if (verifyResult.records.length > 0) {
        let error = "Article already exist";
        return res.status(400).json(error);
    } else {
        try {
            const articleCreated = await Article.create(req.body);
            const projectToConnect = await Project.findById(project_id);

            if (articleCreated && projectToConnect) {
                let article = {};
                const articleID = articleCreated.identity().low;
                const queryToCreateRelation = "MATCH (a:Project),(b:Article)  WHERE ID(a) =" + project_id + " and ID(b) = " + articleID + " CREATE (a)-[x:OWN]->(b)";

                instance.writeCypher(queryToCreateRelation);

                article = articleCreated.properties();
                article.year = articleCreated.get('year').year.low;
                article.articleID = articleID;

                return res.status(200).json({ sucess: "Article created successfully", article })
            }
        } catch (err) {
            return res.json(err);
        }
    }
}

articleController.relateArticlesByID = async (req, res) => {
    const articleID = req.body.articleID;
    const articleToRelateID = req.body.articleToRelateID;
    const relationName = req.body.relationName;
    const project_id = req.params.project_id;
    const queryToRelate = "MATCH (a:Article),(b:Article) WHERE ID(a)=" + articleID + " and ID(b)=" + articleToRelateID + " CREATE (a)-[x:" + relationName + "]->(b) RETURN x";

    try {
        verifyIfRelationExists(project_id, relationName);

        instance.writeCypher(queryToRelate).then(result => {
            if (result) {
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
            article.createdAt = result.records[0]._fields[0].properties.createdAt.year + "/" + result.records[0]._fields[0].properties.createdAt.month + "/" + result.records[0]._fields[0].properties.createdAt.day;
            if (result.records[0]._fields[0].properties.year !== undefined) {
                article.year = result.records[0]._fields[0].properties.year.year.low;
            } else {
                article.year = "";
            }
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
    const queryGetAllArticles = "MATCH (n:Project)-[:OWN]->(b:Article) WHERE id(n)=" + projectID + " WITH n,b OPTIONAL MATCH (b)-[r]->(c:Article) WITH n,b, count (r) as rn OPTIONAL MATCH (b)<-[rl]-(j:Article)  WITH n,b, rn, count (rl) as rnToHim RETURN b,rn, rnToHim";
    try {
        instance.readCypher(queryGetAllArticles).then(result => {
            if (result) {
                let articles = [];

                for (let i = 0; i < result.records.length; i++) {
                    let article = {};
                    article = result.records[i]._fields[0].properties;
                    article.createdAt = result.records[i]._fields[0].properties.createdAt.year + "/" + result.records[i]._fields[0].properties.createdAt.month + "/" + result.records[i]._fields[0].properties.createdAt.day;
                    if (result.records[i]._fields[0].properties.year == undefined) {
                        article.year = "";
                    } else {
                        article.year = result.records[i]._fields[0].properties.year.year.low;
                    }
                    article.articleID = result.records[i]._fields[0].identity.low;
                    article.relatedToNumber = result.records[i]._fields[1].low;
                    article.relatedToHim = result.records[i]._fields[2].low;
                    articles.push(article);
                }
                return res.status(200).json(articles);
            }
        }, (error => {
            console.log(error);
        }));
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
            comment = commentCreated.properties();
            comment.commentID = commentID;
            return res.status(200).json({ sucess: "Comment Created", comment });
        }
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.deleteArticle = async (req, res) => {
    const articleID = req.params.articleID;
    const queryToDeleteArticle = "MATCH (n:Article) WHERE id(n)=" + articleID + " WITH n OPTIONAL MATCH (n)-[:HAS_COMMENTARY]->(c) DETACH DELETE c,n";
    try {
        instance.writeCypher(queryToDeleteArticle);
        return res.status(200).json({ result: "Article was deleted!" });
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

articleController.relateOneToMany = async (req, res) => {
    const project_id = req.params.project_id;
    const articleID = req.body.articleID;
    const articlesToRelate = req.body.articles;
    const relationName = req.body.relationName;
    try {
        let checkRelation = true;
        let proceed = true;

        articlesToRelate.forEach(element => {
            if (articleID == element.articleID) {
                proceed = false;
            }
        });
        if (relationName == "" || relationName == undefined) {
            checkRelation = false;
        }

        if (!checkRelation) {
            return res.status(400).json({ error: "You can't relate without a relation name" });
        }
        if (!proceed) {
            return res.status(400).json({ error: "You can't relate the article to himself" });
        }

        verifyIfRelationExists(project_id, relationName);

        newquery = "MATCH (a:Article) WHERE ID(a) =" + articleID + " WITH a "
        for (let i = 0; i < articlesToRelate.length - 1; i++) {
            newquery += "MATCH (b:Article) WHERE  ID(b)=" + articlesToRelate[i].articleID + " CREATE (a)-[x:" + relationName + "]->(b) WITH a ";
        }
        newquery += "MATCH (b:Article) WHERE  ID(b)=" + articlesToRelate[articlesToRelate.length - 1].articleID + " CREATE (a)-[x:" + relationName + "]->(b) ";
        instance.writeCypher(newquery);
        return res.status(200).json({ success: "Articles Related with success" });
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.getConfigForRunNeoVis = async (req, res) => {
    const project_id = req.params.project_id;
    const query = "Match (a:Project)-[x]->(b:Article) where ID(a)=" + project_id + " WITH a,b,x OPTIONAL MATCH (b:Article)-[z]->(c:Article)  RETURN a,x,z,b,c "
    const config = {
        container_id: "viz",
        server_url: req.body.server_url,
        server_user: req.body.user,
        server_password: req.body.password,
        labels: {
            "Article": {
                "caption": "citation_key"
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
        },
        relationships: {

        },
        arrows: true,
        thickness: "count",
        initial_cypher: query
    };
    return res.status(200).json(config);
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
                    comment.createdAt = result.records[i]._fields[0].properties.createdAt.day.low + "/" + result.records[i]._fields[0].properties.createdAt.month.low + "/" + result.records[i]._fields[0].properties.createdAt.year.low;
                    comments.push(comment);
                }
                return res.status(200).json(comments);
            }
        })
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.deleteCommentFromArticleID = async (req, res) => {
    const commentID = req.params.commentID;
    try {
        comment = await Comment.findById(commentID);
        if (comment) {
            await comment.delete();
            return res.status(200).json({ result: "Comment was deleted!" });
        } else {
            return res.status(400).send("Problem occurred while deleting");
        }
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.editArticle = async (req, res) => {
    const articleID = req.params.articleID;
    const findedArticle = Article.findById(articleID);


    const { error } = editArticleValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    if (findedArticle) {
        (await findedArticle).update(req.body);
        return res.status(200).json({ success: "Article Updated!" });
    } else {
        let error = "Error trying to edit article!"
        return res.status(401).json(error);
    }
}

articleController.getRelationsForProjectID = async (req, res) => {
    const project_id = req.params.project_id;
    const queryToGetRelations = "MATCH (n:Project)-[x:HAS_RELATIONS]->(b:Relations) WHERE ID(n)=" + project_id + " WITH b OPTIONAL MATCH  (b)-[x:OWN]->(z) RETURN z"
    try {
        instance.readCypher(queryToGetRelations).then(result => {
            if (result) {
                let relations = [];

                for (let i = 0; i < result.records.length; i++) {
                    relationName = result.records[i]._fields[0].properties.name;
                    relations.push(relationName);
                }
                return res.status(200).json(relations);
            }
        });
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.removeRelationBetweenArticles = async (req, res) => {
    articleID = req.params.articleID;
    targetArticle = req.body.articleID;
    relationToRemove = req.body.relationName;
    queryRemoveRelation = "MATCH (a:Article)-[r:" + relationToRemove + "]-(b:Article) WHERE ID(a)=" + articleID + " and ID(b)=" + targetArticle + " DELETE r";
    try {
        instance.writeCypher(queryRemoveRelation);
        return res.status(200).json({ success: "Relation removed." });
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.getArticlesRelatedToArticleID = async (req, res) => {
    const articleID = req.params.articleID;
    const queryToGetArticles = "MATCH (n:Article)-[r]-(n2:Article) WHERE ID(n)=" + articleID + " RETURN n2, type(r) as relationName";
    try {
        instance.readCypher(queryToGetArticles).then(result => {
            if (result) {
                let articles = [];
                for (let i = 0; i < result.records.length; i++) {
                    let articleRelated = {};
                    articleRelated.article = result.records[i]._fields[0].properties;
                    articleRelated.article.articleID = result.records[i]._fields[0].identity.low;
                    articleRelated.relationName = result.records[i]._fields[1];
                    articles.push(articleRelated);
                }
                return res.status(200).json(articles);
            }
        });
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.getConfigForArticleID = async (req, res) => {
    const articleID = req.params.articleID;
    const query = "Match (a:Article)-[x]-(b:Article) where ID(a)=" + articleID + "  RETURN a,x,b"
    const config = {
        container_id: "viz",
        server_url: req.body.server_url,
        server_user: req.body.user,
        server_password: req.body.password,
        labels: {
            "Article": {
                "caption": "citation_key",
            },
        },
        relationships: {

        },
        arrows: true,
        thickness: "count",
        initial_cypher: query
    };
    return res.status(200).json(config);
}

articleController.associateFileToArticle = async (req, res) => {
    const articleID = req.params.articleID;
    const filename = req.body.filename;
    const dir = './src/uploadDatabase/uploaded';
    const checkIfFileAlreadyExist = "MATCH (n:Article)-[:HAS_FILES]->(f:File) WHERE id(n)=" + articleID + " AND f.name = '" + filename + "' RETURN f";
    const createNodeFile = "MATCH (n:Article) WHERE id(n)=" + articleID + " CREATE (n)-[:HAS_FILES]->(d:File {name:'" + filename + "'}) RETURN n,d";
    let exist = false;
    try {
        let result = instance.readCypher(checkIfFileAlreadyExist);
        if ((await result).records.length > 0) {
            return res.status(400).json({ error: "File already exist in article" });
        }
        const files = await fs.readdir(dir);
        for (let element in files) {
            if (files[element] == filename) {
                exist = true;
            }
        };
        if (exist) {
            instance.writeCypher(createNodeFile).then(result => {
                return res.status(200).json({ success: "File associated successfully!" });
            });
        }
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}

articleController.getAllUploadedFiles = async (req, res) => {
    const dir = './src/uploadDatabase/uploaded';

    const files = await fs.readdir(dir);
    if (files.length > 0) {
        let filesArray = [];
        for (let element in files) {
            filesArray.push(files[element]);
        };
        return res.status(200).json(filesArray);
    } else {
        return res.status(400).json({ error: "Doesn't exist any file" })
    }
}

articleController.uploadFile = async (req, res) => {
    const file = "./src/uploadDatabase/uploaded/" + req.file.filename;
    const dir = './src/uploadDatabase/uploaded';
    try {
        const files = await fs.readdir(dir);

        for (let element in files) {
            if (files[element] == req.file.filename) {
                await fs.unlink(req.file.path);
                return res.status(400).json({ error: "File already exist!" });
            }
        };

        const data = await fs.readFile(req.file.path);
        await fs.writeFile(file, data);
        await fs.unlink(req.file.path);
        return res.status(200).json({ success: "The file was uploaded!" });

    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}

articleController.downloadFile = async (req, res) => {
    const filename = req.params.filename;
    const dir = './src/uploadDatabase/uploaded';
    const filePath = dir + '/' + filename;
    try {
        const files = await fs.readdir(dir);
        for (let element in files) {
            if (files[element] == filename) {
                res.set("content-type", "application/pdf");
                return res.status(200).download(filePath, filename);
            }
        };
        return res.status(400).json({ error: "File doesn't exist" });
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
}

articleController.getFilesForArticleID = async (req, res) => {
    const articleID = req.params.articleID;
    const queryToGetAllFiles = "MATCH (n:Article)-[:HAS_FILES]->(f:File) WHERE id(n)=" + articleID + " RETURN f";
    try {
        instance.readCypher(queryToGetAllFiles).then(result => {
            let files = [];

            if (result.records.length > 0) {
                for (let element in result.records) {
                    let file = result.records[element]._fields[0].properties;
                    files.push(file);
                }
                return res.status(200).json(files);
            } else {
                return res.status(404).json({ message: "No files found" });
            }
        })
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

articleController.removeFileFromArticle = async (req, res) => {
    const articleID = req.params.articleID;
    const filename = req.body.filename;
    console.log(filename);
    const queryToRemoveFile = "MATCH (n:Article)-[:HAS_FILES]->(f:File) WHERE id(n)=" + articleID + " AND f.name='" + filename + "' DETACH DELETE f";
    console.log(queryToRemoveFile);
    try {
        instance.writeCypher(queryToRemoveFile);
        return res.status(200).json({ success: "File removed successfully!" });
    } catch (err) {
        console.log(error);
        return res.json(err);
    }
}

articleController.deleteFile = async (req, res) => {
    const filename = req.body.filename;
    const dir = './src/uploadDatabase/uploaded';
    const filePath = dir + "/" + filename;
    const queryRemoveFileFromArticles = "Match (f:File) WHERE f.name ='" + filename + "' DETACH DELETE f";
    try {
        const files = await fs.readdir(dir);
        console.log(files);
        for (let element in files) {
            if (files[element] == filename) {
                await fs.unlink(filePath);
                instance.writeCypher(queryRemoveFileFromArticles);
                return res.status(200).json({ success: "File deleted successfully!" });
            }
        };
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

async function verifyIfRelationExists(project_id, relationName) {
    const checkIfRelationExist = "MATCH (p:Project)-[x:HAS_RELATIONS]->(b:Relations) WHERE ID(p)=" + project_id + " WITH b OPTIONAL MATCH (b)-[x:OWN]->(z) WHERE z.name= '" + relationName + "' WITH count(z) as count RETURN count";

    const result = await instance.readCypher(checkIfRelationExist);
    if (result.records[0]._fields[0].low == 0) {
        const queryAddNewRelation = "MATCH (p:Project)-[x:HAS_RELATIONS]->(b:Relations) WHERE ID(p)=" + project_id + " WITH b CREATE (b)-[x:OWN]->(z {name:'" + relationName + "'})";
        (await instance.writeCypher(queryAddNewRelation));
    }
}

module.exports = articleController;