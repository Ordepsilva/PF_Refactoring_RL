const Project = require('../models/Project');
const User = require('../models/User');
const instance = require('../database/database');
const projController = {};

//Método responsável por criar um projeto
projController.createProject = async (req, res) => {

    //Procura pelo user na base de dados
    const user = await User.find(req.auth.username);
    try {
        //Tenta criar o projeto
        const project = await Project.create(req.body);

        //Se o projeto e o user existirem , cria uma relação entre eles
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
                obj.description = result.records[i]._fields[0].properties.description;
                obj.project_name = result.records[i]._fields[0].properties.project_name;
                obj.project_id = result.records[i]._fields[0].properties.project_id;

                projects[i] = obj;
            }
            //retorna uma resposta em json dos projetos existentes
            res.send(projects);

        })
}


module.exports = projController;