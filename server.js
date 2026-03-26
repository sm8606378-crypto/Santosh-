const express=require("express");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const app=express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/myapp");

const User=mongoose.model("User",{username:String,password:String});

app.post("/register",async(req,res)=>{
 const hash=await bcrypt.hash(req.body.password,10);
 await User.create({username:req.body.username,password:hash});
 res.send("created");
});

app.post("/login",async(req,res)=>{
 const user=await User.findOne({username:req.body.username});
 if(!user)return res.json({});
 const ok=await bcrypt.compare(req.body.password,user.password);
 if(!ok)return res.json({});
 const token=jwt.sign({id:user._id},"secret");
 res.json({token});
});

app.listen(3000,()=>console.log("running"));
