const express = require('express');
const bodyParser = require('body-parser');

const Post = require('./models/post');
const mongoose = require('mongoose');

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


app.post("/api/posts",(req,res,next)=>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message:"Post Added Successfully!",
            postId: createdPost._id
        });
    });   
});

app.get("/api/posts", (req, res, next)=>{    
    Post.find()
    .then(documents => {
        res.status(200).json({
            message: "Posts Fetched Successfully!",
            posts: documents
        });  
    });  
});

app.get("/api/posts/:id",(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
     if(post){
         res.status(200).json(post);
     }else{
         res.status(404).json({message:"Post Not Found!"});
     }   
    });
});

app.delete("/api/posts/:id", (req,res,next)=>{
    Post.deleteOne({_id: req.params.id})
    .then(result=>{
       console.log(result); 
    })
    res.status(200).json({message: "Post Deleted!"});
});

app.put("/api/posts/:id",(req,res,next)=>{
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post)
    .then(result=>{
        res.status(200).json({message:"Update Successfull!"});
    });
});

module.exports = app;