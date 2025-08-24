const usermodel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function authUser(req, res , next) {
    const {token }= req.cookies

    if(!token){
        return res.status(400).json({
            message:'unauthorized token',
        })
    }

    try{
      const decoded = jwt.verify(token , process.env.JWT_SECRET)

      const user = await usermodel.findById(decoded.id)

      req.user = user

      next()
    }
    catch(err){
      res.status(401).josn({message:'Unauthorized'})
    }
}


module.exports = {
    authUser
}