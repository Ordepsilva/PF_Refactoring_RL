const Project = require('../models/Project');
const User = require('../models/User');
const instance = require('../database/database');
const { projectCreation, projectEdit } = require('../validations/projectValidation');

const projController = {};

projController.createProject = async (req, res) => {
    const username = req.auth.username;
    const project_name = req.body.project_name;
    
    const { error } = projectCreation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const findedProject = await Project.find(project_name);
    if (findedProject) {
        let error = "Project name already exists!";
        return res.status(400).json(error);
    } else {
        try {
            const project = await Project.create(req.body);
            const user = await User.find(username);
            if (project && user) {
                const project_id = project.identity().low;
                const queryConnectRelationsNodeToProject = "MATCH (n:Project) WHERE ID(n)=" + project_id + " CREATE (n)-[:HAS_RELATIONS]->(a:Relations {name:'Relations'})";
                const queryToRelateProjectToUser = "MATCH (a:User),(b:Project)  WHERE a.username ='" + username + "' and ID(b) = " + project_id + " CREATE (a)-[x:OWN]->(b)";
                const projectCreated = {};

                projectCreated.project_name = project.get('project_name');
                projectCreated.description = project.get('description');
                projectCreated.project_id = project_id;
                projectCreated.subject = project.get('subject');
                dateobj = project.get('createdAt');
                projectCreated.date = dateobj.year + "/" + dateobj.month + "/" + dateobj.day;

                instance.writeCypher(queryToRelateProjectToUser);
                instance.writeCypher(queryConnectRelationsNodeToProject);

                return res.status(200).json({ success: "Project created successfully", projectCreated });
            }
        } catch (err) {
            console.log(err);
            return res.json(err);
        }
    }
}

projController.getProjectsForUser = async (req, res) => {
    const username = req.auth.username;
    const queryToGetAllProjects = "MATCH (a)-[:OWN]->(b) WHERE a.username = '" + username + "' RETURN (b)";

    instance.readCypher(queryToGetAllProjects).then(result => {
        let projects = [];

        for (let i = 0; i < result.records.length; i++) {
            let project = {};
            project.project_name = result.records[i]._fields[0].properties.project_name;
            project.description = result.records[i]._fields[0].properties.description;
            project.project_id = result.records[i]._fields[0].identity.low;
            project.subject = result.records[i]._fields[0].properties.subject;
            date = result.records[i]._fields[0].properties.createdAt.year + "/" + result.records[i]._fields[0].properties.createdAt.month + "/" + result.records[i]._fields[0].properties.createdAt.day;
            project.date = date;

            projects[i] = project;
        }
        projects.reverse();
        return res.status(200).send(projects);
    }, (error => {
        console.log(err);
        return res.status(400).send(error);
    }));
}

projController.editProject = async (req, res) => {
    const project_id = req.params.project_id;
    const paramsToUpdate = {};
    paramsToUpdate.info = req.body;
    const { error } = projectEdit(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const queryFindProject = "MATCH (n:Project) WHERE ID(n)=" + project_id + " SET n += $info RETURN n";
        instance.writeCypher(queryFindProject, paramsToUpdate).then(result => {
            if (result) {
                return res.status(200).json({ response: "Success" });
            }
        });
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

projController.deleteProject = async (req, res) => {
    const project_id = req.params.project_id;
    const queryDeleteProject = " MATCH (p:Project) WHERE id(p)=" + project_id + " WITH p OPTIONAL MATCH (p)-[:OWN]->(a:Article) WITH p,a OPTIONAL MATCH (a)-[:HAS_COMMENTARY]->(c) DETACH DELETE a,c WITH p OPTIONAL MATCH (p)-[:HAS_RELATIONS]->(d:Relations) WITH p,d OPTIONAL MATCH (d)-[:OWN]->(k) DETACH DELETE k,d,p";

    try {
        instance.writeCypher(queryDeleteProject);
        return res.status(200).json({ result: "Project was deleted!" });
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

projController.getProjectInfoById = async (req, res) => {
    const projectID = req.params.project_id;
    const query = "MATCH (n:Project) WHERE ID(n)=" + projectID + " RETURN n";
    try {
        instance.readCypher(query).then(result => {
            let project = {};

            project.project_name = result.records[0]._fields[0].properties.project_name;
            project.description = result.records[0]._fields[0].properties.description;
            project.project_id = result.records[0]._fields[0].identity.low;
            project.subject = result.records[0]._fields[0].properties.subject;
            date = result.records[0]._fields[0].properties.createdAt.day + "/" + result.records[0]._fields[0].properties.createdAt.month + "/" + result.records[0]._fields[0].properties.createdAt.year;
            project.date = date;
            return res.send(project);
        });
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

module.exports = projController;