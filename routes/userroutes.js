const express = require('express')
const router = express.Router()

const userController = require('../controller/usercontroller')

//All THE API ROUTES

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard', userController.dashboard);
router.get('/admin/list', userController.listAll);
router.post('/delete-user', userController.deleteuser);
router.get('/search-user', userController.search);
router.post('/create-profile', userController.regsterProfile);
router.post('/uploadcourse', userController.teacher);
router.post('/comments', userController.comment);



module.exports = router