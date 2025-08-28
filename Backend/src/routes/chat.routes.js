const express = require('express')
const chatController = require('../controllers/chat.controllers')
const authMiddleware = require('../middlewares/auth.middlewares')


const router = express.Router()


router.post('/',authMiddleware.authUser,chatController.createChat)


module.exports = router