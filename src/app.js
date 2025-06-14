const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

// get all users
app.get("/feed", async(req, res) => {
    try{
       const users = await User.find({})
       res.send(users)
    }catch(err){
        res.status(500).send("Error in fetching user: " + err.message);
    }
}
);

//get user by email
app.get("/user", async(req, res) => {
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
app.delete("/user", async(req, res) => {
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
app.patch("/user", async(req, res) => {
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

// signup user
app.post("/signup", async (req, res) => {
    console.log(req.body)
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      gender: req.body.gender,
        photoUrl: req.body.photoUrl || "https://www.w3schools.com/howto/img_avatar.png",
        about: req.body.about || "Hey there! I am using DevTinder",
        skills: req.body.skills || []
    });
    try{
        
        await user.save();
        res.send("User Added Successfully");
    }catch(err){
        res.status(500).send("Error in adding user: " + err.message);
    }
});


connectDB().then(() => {
  console.log("Connection established");
  app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
}
).catch((error) => {
  console.error("Connection error:", error);
});


