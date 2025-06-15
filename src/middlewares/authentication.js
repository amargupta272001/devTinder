const jwt = require('jsonwebtoken');
const User = require('../models/user');


const TOKEN_SECRET = "ksbcdkjabsdjkcbiuweagsfiuogasdvbc@adsbvkjbakd2134jbdsfk&#^@$*&*#@!";

const userAuth = async(req,res,next) => {
    try{
        const {token} = req.cookies;
        if(!token) throw new Error("Authentication failed! Please login again");

        const decodedObj = jwt.verify(token, TOKEN_SECRET);
        const {userId} = decodedObj;

        const user = await User.findById(userId);
        if(!user) throw new Error("User not found!");

        req.user = user;
        
        next();// Attach user to request object
    }catch(err){
        return res.status(401).send("Error:"+ err.message);
    }
}

module.exports = {userAuth};