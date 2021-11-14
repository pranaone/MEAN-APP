const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/meanDB")
.then(()=>{
    console.log('Connected to database!');
})
.catch(()=>{
    console.log('Connection failed!')
});

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    res.setHeader("Access-Control-Allow-Methods","*");
    next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;