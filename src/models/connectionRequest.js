const moongoose = require("mongoose");


const connectionRequestSchema = new moongoose.Schema({
    fromUserId: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    toUserId: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
         ref: 'User',
    },
    status: {
        type: String,
        enum: {
            values : ["interested","ignored","accepted","rejected"],
            message: '{VALUE} is not a valid status'
        }
    }
},
{
    timestamps: true
}
);

connectionRequestSchema.pre("save", async function( next) {
    if(this.fromUserId.toString() === this.toUserId.toString()) throw new Error("You cannot send a connection request to yourself!");
    next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = moongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;