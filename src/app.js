const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profileRouter');
const userRouter = require('./routes/userRouter');
const connectionRequestRouter = require('./routes/connectionRequest');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', connectionRequestRouter);

connectDB().then(() => {
  console.log("Connection established");
  app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
}
).catch((error) => {
  console.error("Connection error:", error);
});


