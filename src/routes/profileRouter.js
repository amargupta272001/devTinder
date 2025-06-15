const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/authentication');
const { validateProfileEditData, validateProfilePasswordData} = require('../utils/validation');
const bcrypt = require('bcrypt');

// profile view
profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

// profile edit
profileRouter.patch("/profile/edit",userAuth, async (req, res) => {
    try{
       const isEditAllowed =  validateProfileEditData(req);
        if(!isEditAllowed) throw new Error("Profile edit not Allowed");

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            if(loggedInUser[key] !== undefined){
                loggedInUser[key] = req.body[key];
            }
        });

        const updatedUser = await loggedInUser.save();
        if(!updatedUser) throw new Error("Error in updating profile");

        res.json({message: `${loggedInUser.firstName} Profile updated successfully`, data: loggedInUser});
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

// profile edit
profileRouter.patch("/profile/password",userAuth, async (req, res) => {
    try{
        validateProfilePasswordData(req);
        const {currentPassword, newPassword} = req.body;
        
        const loggedInUser = req.user;
        const isPasswordValid = await loggedInUser.isPasswordValid(currentPassword);
        if(!isPasswordValid) throw new Error("Enter valid password");

        // Hash the new password
        loggedInUser.password = await bcrypt.hash(newPassword, 10);

        const updatedUser = await loggedInUser.save();
        if(!updatedUser) throw new Error("Error in updating profile");

        res.json({message: `${loggedInUser.firstName} Profile password updated successfully`, data: loggedInUser});
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = profileRouter;

