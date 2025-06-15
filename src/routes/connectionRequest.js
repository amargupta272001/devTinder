const express = require('express');
const connectionRequestSchema = require('../models/connectionRequest');
const {userAuth} = require('../middlewares/authentication')
const {validateConnectionRequest} = require('../utils/validation');
const User = require('../models/user');

const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        validateConnectionRequest(req)

        const { status, toUserId } = req.params;
        const {_id:fromUserId} = req.user
        if (!toUserId || !fromUserId) throw new Error("Invalid Request!!");

        const toUserObj = await User.findById(toUserId)
        if(!toUserObj) throw new Error("User not found! "+ toUserId);

        const existingConnectionRequest = await connectionRequestSchema.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingConnectionRequest) throw new Error("Connection request already exists!");

        const connectionRequest = new connectionRequestSchema({
            fromUserId,
            toUserId,
            status
        });

        const saveConnectionRequest = await connectionRequest.save();
        if(!saveConnectionRequest) throw new Error("Something went wrong!");

        res.json({message:"Connection request sent successfully", data: saveConnectionRequest});
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}
);

connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
   try{
        const {_id} = req.user
        const { status, requestId }  = req.params;
        const validStatus = ['accepted', 'rejected'];
        const isStatusValid = validStatus.includes(status);
        if (!isStatusValid) throw new Error("Invalid status value!");

        const connectionRequest = await connectionRequestSchema.findOne({
            status: 'interested',
            toUserId: _id,
            _id: requestId
        });

        console.log(connectionRequest)
        if(!connectionRequest) throw new Error("Connection request not found or already processed!");
        connectionRequest.status = status;
        const updatedConnectionRequest = await connectionRequest.save();
        if(!updatedConnectionRequest) throw new Error("Something went wrong!");
        res.json({message: "Connection request reviewed successfully", data: updatedConnectionRequest});

   }catch(err){
         res.status(400).send("Error: " + err.message);
   }
});

module.exports = connectionRequestRouter