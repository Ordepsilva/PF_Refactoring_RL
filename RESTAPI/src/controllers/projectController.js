const Project = require('../models/Project');
const User = require('../models/User');
const instance = require('../database/database');
const { projectCreation } = require('../validations/projectValidation');

const projController = {};

projController.createProject = async (req, res) => {
    const user = await User.find(req.auth.username);
    const { error } = projectCreation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const project = await Project.create(req.body);
        console.log(project);
        if (project && user) {
            const obj = {};
            obj.project_name=  project.get('project_name');
            obj.description = project.get('description');
            obj.project_id = project.get('project_id');
            obj.subject = project.get('subject');
            dateobj= project.get('createdAt');
            obj.date = dateobj.day + "/" + dateobj.month + "/" + dateobj.year;
            const project_id = project.get('project_id');
            const query = "MATCH (a:Utilizadores),(b:Projeto)  WHERE a.username ='" + req.auth.username + "' and b.project_id = '" + project_id + "' CREATE (b)-[x:PERTENCE]->(a)";
            instance.writeCypher(query);
            return res.status(200).json({ success: "Projeto criado com sucesso", obj });
        }
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

projController.getProjectsForUser = async (req, res) => {
    const query = "MATCH (b)-[:PERTENCE]->(a) WHERE a.username = '" + req.auth.username + "' RETURN (b)";

    instance.readCypher(query)
        .then(result => {
            let projects = [];
            for (let i = 0; i < result.records.length; i++) {
                let obj = {};
                let date = "";
                obj.project_name = result.records[i]._fields[0].properties.project_name;
                obj.description = result.records[i]._fields[0].properties.description;
                obj.project_id = result.records[i]._fields[0].properties.project_id;
                obj.subject = result.records[i]._fields[0].properties.subject;
                date = result.records[i]._fields[0].properties.createdAt.day + "/" + result.records[i]._fields[0].properties.createdAt.month + "/" + result.records[i]._fields[0].properties.createdAt.year;
                obj.date = date;
                projects[i] = obj;
            }
            projects.reverse();
            res.send(projects);
        })
}

projController.editProject = async (req, res) => {
    const { error } = projectedit(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const projectToUpdate = await Project.find(req.params.project_id);
        if (projectToUpdate) { 
            await projectToUpdate.update(req.body);
            return res.status(200).json({response:"Success"});
        }
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

projController.deleteProject = async (req, res) => {
    try {
        projectTodelete = await Project.find(req.params.project_id);
        console.log(projectTodelete);
        if (projectTodelete) {
            await projectTodelete.delete();
            return res.status(200).json({result:"Project was deleted!"});
        } else {
            return res.status(400).send("Problem occurred while deleting");
        }
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

projController.getProjectInfoById = async (req, res) => {
    const query = "MATCH (n:Projeto) WHERE n.project_id='" + req.params.project_id + "'RETURN n";
    try {
        instance.readCypher(query).then(result => {
            var obj = {};
            var date = "";
            obj.project_name = result.records[0]._fields[0].properties.project_name;
            obj.description = result.records[0]._fields[0].properties.description;
            obj.project_id = result.records[0]._fields[0].properties.project_id;
            obj.subject = result.records[0]._fields[0].properties.subject;
            date = result.records[0]._fields[0].properties.createdAt.day + "/" + result.records[0]._fields[0].properties.createdAt.month + "/" + result.records[0]._fields[0].properties.createdAt.year;
            obj.date = date;
            return res.send(obj);
        });

    } catch (err) {
        console.log(err);
        return res.send(err);
    }
}

module.exports = projController;