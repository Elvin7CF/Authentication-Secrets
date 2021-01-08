//jshint esversion:6
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//用mongoose-encrytion模块加密password
//把密钥保存在.env隐藏文件中，通过dotenv模块调用他
userSchema.plugin(encrypt,{ secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email: username,
        password: password
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    res.send("密码错误");
                }
            }
        }
    })
})


app.listen(3000,function(){
    console.log("Server started on port 3000.");
})