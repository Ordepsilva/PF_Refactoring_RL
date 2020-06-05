const express = require('express');
const router = express.Router();
const {authorized}  =require('../middlewares/authorize');
const userController = require("../controllers/userController");

/*Rota responsável por efetuar o login*/
router.post('/login', userController.login);

/*Rota responsável por efetuar o Registo*/
router.post('/register', userController.register);

/*Rota responsável por retornar as informações do utilizador */
router.get('/getUserInfo', authorized(), userController.getUserInfo);
module.exports = router;