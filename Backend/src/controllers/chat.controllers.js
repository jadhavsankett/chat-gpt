const chatmodel = require('../models/chat.model');
const messageModel = require('../models/message.model');

async function createChat(req, res) {
    try {
        const { title } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        const chat = await chatmodel.create({
            user: user._id,
            title
        });

        return res.status(201).json({
            message: 'Chat created successfully',
            chat: {
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user
            }
        });
    } catch (err) {
        console.error('Error creating chat:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function getchats(req, res) {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        const chats = await chatmodel.find({ user: user._id });

        return res.status(200).json({
            message: 'Chats fetched successfully',
            chats: chats.map(chat => ({
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user
            }))
        });
    } catch (err) {
        console.error('Error fetching chats:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function getMessages(req, res) {
   
        const chatId = req.params.id;

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        return res.status(200).json({
            message: 'Messages fetched successfully',
            messages: messages
         })
}


module.exports = { createChat, getchats, getMessages };
