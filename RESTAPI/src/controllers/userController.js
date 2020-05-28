const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authconfig = require('../config/auth.json');
const { loginValitadion, registerValidation } = require('../validations/userValidation');
const userController = {};

/**
 * Método responsável por efetuar o login
 */
userController.login = async (req, res) => {
    let bdusername;
    let bdpassword;
    let id;
    /*Valida a estrutuda do body recebido */
    const { error } = loginValitadion(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    /* Verifica se o username existe na base de dados */
    const findeduser = await User.find(req.body.username);

    /*Caso não exista retorna um erro a identificar o problema */
    if (!findeduser) {
        return res.status(400).send(' Wrong username');
    } else {
        /*Caso exista recebe as informações desse user */
        bdusername = findeduser.get('username');
        bdpassword = findeduser.get('password');
        id = findeduser.get('id');
    }

    /*Compara a password que se encontra na Base de dados com a inserida pelo user */
    const validPassword = await bcrypt.compare(req.body.password, bdpassword);
    /*Se estiver errada retorna uma resposta de erro */
    if (!validPassword) {
        return res.status(400).send('Invalid Password');
    }
    /*Gera um novo token para o user*/
    const token = jwt.sign({ id: id, username: bdusername }, authconfig.secret)
    /*Retorna uma resposta de sucesso com o token gerado */
    return res.status(200).cookie('authToken', token, { expires: new Date(Date.now + 10 * 60000), httpOnly: true }).send({ AuthToken: token });
}

/**
 * Método responsável por efetuar o registo de um user
 */
userController.register = async (req, res) => {
    let bdusername;
    let id;

    /*Valida a estrutuda do body recebido */
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const person = req.body;
    /*Verifica se o username já existe */
    const findeduser = await User.find(req.body.username);
    /*Se existir retorna uma mensagem de erro */
    if (findeduser) {
        return res.status(400).send('Username is already in use!')
    }


    try {
        /*É Encriptada a password */
        const hash = await bcrypt.hash(person.password, 10);
        console.log(person.password);
        person.password = hash;
        /*Tenta criar o utilizador na base de dados */
        const user = await User.create(person);

        if (user) {
            /*Se o utilizador for criado com sucesso , a password é omitida */
            person.password = undefined;
            /*Caso exista recebe as informações do user criado*/
            bdusername = user.get('username');
            id = user.get('id');

            /*É gerado um novo token para o user */
            const token = jwt.sign({ id: id, username: bdusername }, authconfig.secret);
            /*Retorna uma mensagem de sucesso com os dados do user criado e o token*/
            return res.status(200).send({ person, AuthToken: token });
        }

    } catch (err) {
        /*Caso exista algum erro a criar o user é retornado o erro */
        console.log(err);
        return res.json(err);
    }
}

module.exports = userController;