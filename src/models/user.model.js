const mongoose = require('mongoose')


const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        firstName:{
            type:String,
            required:true
        },
         lastName:{
            type:String,
            required:true
        }
    },
    password:{
        type:String
    }
},{
    timestamps:true
})


const usermodel = new mongoose.model('user',userschema)


module.exports = usermodel