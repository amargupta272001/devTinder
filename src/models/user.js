const moongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const TOKEN_SECRET = "ksbcdkjabsdjkcbiuweagsfiuogasdvbc@adsbvkjbakd2134jbdsfk&#^@$*&*#@!";

const userSchema = new moongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email format");
            }
        }  
    },
    password: {
        type: String,
        required: true,
         validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter Strong password");
            }
        }  
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    photoUrl: {
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png",
         validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid URL format");
            }
        }   
    },
    about: {
        type: String,
        default: "Hey there! I am using DevTinder"
    },
    skills: {
        type: [String],
        default: [""]
    },
},{timestamps: true});

userSchema.methods.getJWT = async function() {
    const user = this;
    const jwtToken =  await jwt.sign({ userId: user._id }, TOKEN_SECRET, { expiresIn: "1d" });
    return jwtToken
}

userSchema.methods.isPasswordValid = async function(passwordByUser) {
    const {password: passHash} = this;
    const isPasswordValid = await bcrypt.compare(passwordByUser, passHash);
    return isPasswordValid;
}  

const User = moongoose.model("User", userSchema);
module.exports = User;