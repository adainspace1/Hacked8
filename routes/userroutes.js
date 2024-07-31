const express = require('express')
const router = express.Router()
const multer  = require('multer')
const {register, login, dashboard, deleteuser, regsterProfile, listAll, search, comment} = require('../controller/usercontroller')


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
//All THE API ROUTES

router.post('/register', upload.single('image'),register);
router.post('/login', login);
router.get('/dashboard', dashboard);
router.get('/admin/list', listAll);
router.post('/delete-user', deleteuser);
router.get('/search-user', search);
router.post('/create-profile', regsterProfile);
router.post('/comments', comment);



module.exports = router