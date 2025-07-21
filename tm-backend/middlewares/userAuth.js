const jwt = require("jsonwebtoken")
const User = require('../models/user')
const userAuth = async(req,res,next) => {

    try{
        const {token} = req.cookies ;
        if(!token){
            throw new Error("Login Required !! ")
        }

        const {_id} = jwt.verify(token, process.env.JWT_SECRET) ;
        if(!_id){
              throw new Error("Invalid Token, Login again")
        }

        const user = await User.findOne({_id:_id}) ;
         if(!user){
              throw new Error("Invalid User")
        }

        req.user = user ;
        next();

    }catch(err)
{
res.status(400).json({message:"Something went wrong !! " + err.message}) 
}
}

module.exports = userAuth;