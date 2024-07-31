const express = require('express')
const router = express.Router()
const multer  = require('multer')
const {uploadProduct} = require('../controller/upload')

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
//All THE API ROUTES

router.post('/uploadcourses', upload.single('image'), uploadProduct);



module.exports = router