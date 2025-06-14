const moongoose = require("mongoose");

const url = "mongodb+srv://amargupta272001:D9bpjZZNhkA0LeId@learnnode.tbjpw2h.mongodb.net/devTinder"

const connectDB = async () => {
  try {
    await moongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
module.exports = connectDB;

