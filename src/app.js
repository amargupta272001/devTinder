const express = require('express');

const app = express();

app.use("/test",(req,res)=>{
  res.send('Hello World');
})
app.use("/dashboard",(req,res)=>{
  res.send('Hello dashboard');
})
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);