const express = require('express');
const router = express.Router();
const {authorized}  =require('../middlewares/authorize');
const userController = require("../controllers/userController");

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/getUserInfo', authorized(), userController.getUserInfo);

module.exports = router;