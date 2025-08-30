require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const path = require('path')

/* use middlewares */
const authRutes = require('./routes/auth.routes')
const chatRutes = require('./routes/chat.routes')


const app = express()


/* middlewares */
// app.use(cors({
//     origin:'http://localhost:5173',
//     credentials:true
// }))

app.use(cors({
  origin: ["http://localhost:5173", "https://chat-gpt-h08n.onrender.com"], 
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'../public'))) //changes


/* api's */
app.use('/api/auth',authRutes)
app.use('/api/chat',chatRutes)


app.get('*name', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')) //changes
})

module.exports = app