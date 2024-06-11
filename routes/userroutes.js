const express = require('express')
const router = express.Router()

const userController = require('../controller/usercontroller')

//All THE API ROUTES

// router.get('/', userController.listUsers);
router.get('/:id', userController.showUser);
router.post('/', userController.createUser);
router.post('/register', userController.register);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.login);
router.get('/dashboard', userController.dashboard);
router.get('/logout', userController.logout);


router.get('/list', userController.listUsers);


module.exports = router