const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignupData, validateLoginData} = require('../utils/validation');

// signup user
authRouter.post("/signup", async (req, res) => {

    try{
        //validate user data
        validateSignupData(req);
        const {firstName, lastName, email, password, age, gender, photoUrl, about, skills} = req.body;

        //decrypt
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            gender,
            photoUrl,
            about,
            skills
        });

        await user.save();
        res.send("User Added Successfully");
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

// signup user
authRouter.post("/login", async (req, res) => {
    
    try{
        //validate user data
        validateLoginData(req);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) throw new Error("Invalid credentials");

        // Check if the password is valid
        const isPasswordValid = await user.isPasswordValid(password)
        if(!isPasswordValid) throw new Error("Invalid credentials");

        // set jwt token
        const token = await user.getJWT();

        // Set a cookie with the user ID
        res.cookie('token',token,{expires: new Date(Date.now() + 1 * 3600000)}); // set expires in 1 day
        res.send("Login Successful!!");
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

//
authRouter.post("/logout", async(req,res) => {
    try{
        // TODO:: cleanup anything if needed
        // Clear the cookie by setting its expiration date to a past date
        res.cookie('token', null, { expires: new Date(Date.now()) }).send("Logout Successful!!");
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
}
);

module.exports = authRouter;
