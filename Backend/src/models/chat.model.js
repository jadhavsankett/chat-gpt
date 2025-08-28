const mongoose = require('mongoose')


const chatschema = new mongoose.Schema({
    user:{
        type:String,
        ref:'user',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    lastActivity:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

const chatmodel = new mongoose.model('chat',chatschema)



module.exports = chatmodel