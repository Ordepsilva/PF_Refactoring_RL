const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authconfig = require('../config/auth.json');
const { loginValitadion, registerValidation } = require('../validations/userValidation');
const userController = {};

userController.login = async (req, res) => {
    let bdusername;
    let bdpassword;
    let id;
    const { error } = loginValitadion(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const findeduser = await User.find(req.body.username);
    if (!findeduser) {
        return res.status(400).send("Username and password don't match!");
    } else {
        bdusername = findeduser.get('username');
        bdpassword = findeduser.get('password');
        id = findeduser.get('id');
    }

    const validPassword = await bcrypt.compare(req.body.password, bdpassword);

    if (!validPassword) {
        return res.status(401).send('Invalid Password');
    }

    const token = jwt.sign({ id: id, username: bdusername }, authconfig.secret);

    return res.status(200).cookie('authToken', token, { expires: new Date(Date.now + 10 * 60000), httpOnly: true }).send({ AuthToken: token });
}

userController.register = async (req, res) => {
    let bdusername;
    let id;
    const person = req.body;

    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
    const findeduser = await User.find(req.body.username);
    if (findeduser) {
        return res.status(400).send('Username is already in use!')
    }

    try {
        const hash = await bcrypt.hash(person.password, 10);
        person.password = hash;
        const user = await User.create(person);
        
        if (user) {
            person.password = undefined;
            bdusername = user.get('username');
            id = user.get('id');
            const token = jwt.sign({ id: id, username: bdusername }, authconfig.secret);
            return res.status(200).cookie('authToken', token, { expires: new Date(Date.now + 10 * 60000), httpOnly: true }).send({ AuthToken: token });
        }
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

userController.getUserInfo = async (req, res) => {
    username = req.auth.username;
    res.send({ username });
}

module.exports = userController;