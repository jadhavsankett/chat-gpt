const mongoose = require('mongoose')


async function connectDB() {
    try{
       await mongoose.connect(process.env.MONGOSE_URL)
        console.log("connet to data base")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDB