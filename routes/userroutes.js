const express = require('express')
const router = express.Router()

const userController = require('../controller/usercontroller')

//All THE API ROUTES

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard', userController.dashboard);




module.exports = router