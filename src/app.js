require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')

/* use middlewares */
const authRutes = require('./routes/auth.routes')
const chatRutes = require('./routes/chat.routes')


const app = express()

/* middlewares */
app.use(express.json())
app.use(cookieParser())


/* api's */
app.use('/api/auth',authRutes)
app.use('/api/chat',chatRutes)

module.exports = app