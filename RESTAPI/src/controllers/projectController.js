const Project = require('../models/Project');
const User = require('../models/User');
const instance = require('../database/database');
const projController = {};


projController.createProject = async (req, res) => {

    //Procura pelo o user
    const user = await User.find(req.auth.username);
    try {
        const project = await Project.create(req.body);

        if (project && user) {
            const project_id = project.get('project_id');
            const query = "MATCH (a:Utilizadores),(b:Projeto)  WHERE a.username ='" + req.auth.username + "' and b.project_id = '" + project_id + "' CREATE (b)-[x:PERTENCE]->(a)";
            instance.writeCypher(query);
            return res.status(200).send('Projeto criado com sucesso');
        }

    } catch (err) {
        console.log(err);
        return res.json(err);
    }

}



projController.getProjectsForUser = async (req, res) => {

    const query = "MATCH (b)-[:PERTENCE]->(a) WHERE a.username = '"+ req.auth.username + "' RETURN (b)";

    instance.readCypher(query)
        .then(result => {
            var projects = [];

            for (let i = 0; i < result.records.length; i++) {
                var obj ={};
                obj.description = result.records[i]._fields[0].properties.description;
                obj.project_name = result.records[i]._fields[0].properties.project_name;
                obj.project_id = result.records[i]._fields[0].properties.project_id;

                projects[i] = obj;
            }
            res.json(projects);

        })
}

module.exports = projController;