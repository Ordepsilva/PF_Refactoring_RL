const Project = require('../models/Project');
const User = require('../models/User');
const instance = require('../database/database');
const { projectCreation } = require('../validations/projectValidation');

const projController = {};

//Método responsável por criar um projeto
projController.createProject = async (req, res) => {

    //Procura pelo user na base de dados
    const user = await User.find(req.auth.username);

    const { error } = projectCreation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        //Tenta criar o projeto
        const project = await Project.create(req.body);

        console.log(project);
        //Se o projeto e o user existirem , cria uma relação entre eles
        if (project && user) {
            const project_id = project.get('project_id');
            const query = "MATCH (a:Utilizadores),(b:Projeto)  WHERE a.username ='" + req.auth.username + "' and b.project_id = '" + project_id + "' CREATE (b)-[x:PERTENCE]->(a)";
            instance.writeCypher(query);
            return res.status(200).json({success:"Projeto criado com sucesso"});
        }

    } catch (err) {
        console.log(err);
        return res.json(err);
    }

}

//Método responsável por receber os projetos 
projController.getProjectsForUser = async (req, res) => {

    //query responsável por criar uma relação do projeto ao user
    const query = "MATCH (b)-[:PERTENCE]->(a) WHERE a.username = '"+ req.auth.username + "' RETURN (b)";

    //corre a query na base de dados
    instance.readCypher(query)
        .then(result => {
            var projects = [];
            //Guarda os objetos recebidos pela query, num novo array de objetos
            for (let i = 0; i < result.records.length; i++) {
                var obj ={};
                var date="";
                obj.project_name = result.records[i]._fields[0].properties.project_name;
                obj.description = result.records[i]._fields[0].properties.description;
                obj.project_id = result.records[i]._fields[0].properties.project_id;
                obj.subject = result.records[i]._fields[0].properties.subject;
                date = result.records[i]._fields[0].properties.createdAt.day +"/" + result.records[i]._fields[0].properties.createdAt.month + "/" + result.records[i]._fields[0].properties.createdAt.year;
                obj.date= date;
                projects[i] = obj;
            }
            //retorna uma resposta em json dos projetos existentes
            projects.reverse();
            res.send(projects);

        })
}


module.exports = projController;