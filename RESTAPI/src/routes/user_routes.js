const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");

/*Rota responsável por efetuar o login*/
router.post('/login', userController.login);

/*Rota responsável por efetuar o Registo*/
router.post('/register', userController.register);


module.exports = router;