const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');

// get all users
userRouter.get("/feed", async(req, res) => {
    try{
       const users = await User.find({})
       res.send(users)
    }catch(err){
        res.status(500).send("Error in fetching user: " + err.message);
    }
}
);

//get user by email
userRouter.get("/user", async(req, res) => {
    const userEmail = req.body.email;
    try{
       const users = await User.find({email: userEmail})
       if(users.length === 0) {
           return res.status(404).send("User not found");
       }
       res.send(users)
    }catch(err){
        res.status(500).send("Error in fetching user: " + err.message);
    }
}
);

// delete user by id
userRouter.delete("/user", async(req, res) => {
    const userId = req.body.userId;
    try{
       const result = await User.findByIdAndDelete(userId);
       if(!result) {
           return res.status(404).send("User not found");
       }
       res.send("User deleted successfully");
    }catch(err){
        res.status(500).send("Error in deleting user: " + err.message);
    }
}
);

// update user by id
userRouter.patch("/user", async(req, res) => {
    const userId = req.body.userId;
    const updateData = req.body;
    try{
       const result = await User.findByIdAndUpdate(userId, updateData, { new: true, returnDocument: "after" });
       if(!result) {
           return res.status(404).send("User not found");
       }
       res.send(result);
    }
    catch(err){
        res.status(500).send("Error in updating user: " + err.message);
    }
}
);

module.exports = userRouter;
