const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMomory, queryMemory } = require("../services/vector.service");
const {
  chat,
} = require("@pinecone-database/pinecone/dist/assistant/data/chat");
const generateVector = require("../services/ai.service");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  /* socket io middleware */
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("authontication error: No token provide "));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      socket.user = user;

      next();
    } catch (err) {
      next(new Error("authontication error : invalid token"));
    }
  });

  
  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      // console.log(messagePayload);

      const [message, vectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        }),
        aiService.generateVector(messagePayload.content),
      ]);

      await createMomory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content,
          },
        });

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVectors: vectors,
          limit: 3,
          metadata: {
            user: socket.user._id,
          },
        }),
        messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createAt: -1 })
          .limit(20)
          .lean(),
      ]);

      /* add short term memory */
      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      /* add long term memory */
      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `
            these are some previous messages from the chat , use them to generate a response:
            ${memory.map((item) => item.metadata.text).join("\n")}
            `,
            },
          ],
        },
      ];

      const response = await aiService.generateResponse([...ltm, ...stm]);


      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });

      const [responseMessage, responseVectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: response,
          role: "model",
        }),
        aiService.generateVector(response),
      ]);

      await createMomory({
        vectors: responseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });

    });
  });
}

module.exports = initSocketServer;
