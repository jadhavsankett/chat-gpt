const express = require('express')
const chatController = require('../controllers/chat.controllers')
const authMiddleware = require('../middlewares/auth.middlewares')


const router = express.Router()


router.post('/',authMiddleware.authUser,chatController.createChat)


/* GET API */
router.get('/',authMiddleware.authUser,chatController.getchats)

/* GET/api/chat/messages/:id */
router.get('/messages/:id',authMiddleware.authUser,chatController.getMessages)

module.exports = router