const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignupData, validateLoginData} = require('./utils/validation');
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const {userAuth} = require('./middlewares/authentication');

app.use(express.json());
app.use(cookieParser());

const TOKEN_SECRET = "ksbcdkjabsdjkcbiuweagsfiuogasdvbc@adsbvkjbakd2134jbdsfk&#^@$*&*#@!";

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

// profile 
app.post("/profile",userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

// signup user
app.post("/login", async (req, res) => {
    
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

connectDB().then(() => {
  console.log("Connection established");
  app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
}
).catch((error) => {
  console.error("Connection error:", error);
});


