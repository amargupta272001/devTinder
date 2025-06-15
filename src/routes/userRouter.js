const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middlewares/authentication')
const connectionRequestSchema = require('../models/connectionRequest');

const USER_SAFE_FIELDS = 'firstName lastName photoUrl age gender about skills';
const MAX_LIMIT = 50;
const MIN_PAGE = 1;
//get all the pending connection requests for the logged-in user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
   try{
    const loggedInUser =  req.user;
    const connectionRequest = await connectionRequestSchema.find({
        toUserId: loggedInUser._id,
        status: 'interested'
    }).populate('fromUserId', USER_SAFE_FIELDS);

    res.json({message:"Data fetched successfully", data: connectionRequest});
   }catch(err){
        res.status(400).send("Error: " + err.message);
   }
});

// get all the connection requests for the logged-in user
userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await connectionRequestSchema.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        })
        .populate('fromUserId', USER_SAFE_FIELDS)
        .populate('toUserId', USER_SAFE_FIELDS);


        const data = connections.map((d) => {
            if (d.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return d.toUserId;
            }
            return d.fromUserId;
        });

        res.json({message:"Data fetched successfully", data: data});
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

//get feed
userRouter.get("/user/feed", userAuth, async(req, res) => {
    try{
        // Pagination parameters
        let page = parseInt(req.query.page) || 1;
        page = page < MIN_PAGE ? MIN_PAGE : page; // Ensure page is at least 1

        let limit = parseInt(req.query.limit) || 2;
        limit = limit > MAX_LIMIT ? MAX_LIMIT : limit; // Limit to a maximum of 50 items per page
        
        const skip = (page - 1) * limit;

        const loggedInUser = req.user;
        const connections = await connectionRequestSchema.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connections.forEach((d) => {
            hideUsersFromFeed.add(d.fromUserId.toString());
            hideUsersFromFeed.add(d.toUserId.toString());
        });
        
        const users = await User.find({
            $and:[
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_FIELDS).skip(skip).limit(limit);

        res.json({message:"Feed fetched successfully", data: users});
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = userRouter;
