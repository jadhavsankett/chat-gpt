const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.service')
const messageModel = require('../models/message.model')
const {createMomory , queryMemory } = require('../services/vector.service');
const { chat } = require("@pinecone-database/pinecone/dist/assistant/data/chat");
const generateVector = require("../services/ai.service");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  /* socket io middleware */
  io.use(async(socket,next)=>{

    const cookies = cookie.parse(socket.handshake.headers?.cookie || "")

    if(!cookies.token){
      next(new Error('authontication error: No token provide '))
    }

    try{
      const decoded  = jwt.verify(cookies.token , process.env.JWT_SECRET)

      const user = await userModel.findById(decoded.id)

      socket.user = user

      next()
    }
    catch (err) {
      next(new Error('authontication error : invalid token'))
    }

  })


  io.on("connection", (socket) => {
   
    socket.on('ai-message',async(messagePayload)=>{

       console.log(messagePayload)

       /* input massage */
      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: 'user'
       })

      const vectors = await aiService.generateVector(messagePayload.content)

         const memory = await queryMemory({
       queryVectors:vectors,
      limit:3,
      metadata:{}
     })

     await createMomory({
        vectors,
        messageId: message._id,
        metadata:{
          chat:messagePayload.chat,
          user:socket.user._id,
          text:messagePayload.content
        }
     })

  

     console.log(memory)


       /* sort term memory */
       const chatHistory = (await messageModel.find({
        chat:messagePayload.chat
       }).sort({createAt:-1}).limit(20).lean()).reverse()


       const response = await aiService.generateResponse(chatHistory.map(item=>{
        return {
          role: item.role,
          parts: [{ text:item.content }]
        }
       }))

       /* out-put massage */
      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: 'model'
       })


       const responseVectors = await aiService.generateVector(response)

       await createMomory({
        vectors:responseVectors,
        messageId:responseMessage._id,
        metadata:{
          chat:messagePayload.chat,
          user:socket.user._id,
          text:response
        }
       })

       socket.emit('ai-response',{
        content:response,
        chat:messagePayload.chat
       })

    })

  });
}


module.exports = initSocketServer
