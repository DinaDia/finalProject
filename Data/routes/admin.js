const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const MarketData = require("../models/market");
const Admin = require("../models/admin");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.jwtSecret, { expiresIn: "1d" });
};

router.post('/signup',asyncHandler(async(req,res)=>{
    const { name, email, password } = req.body;
    if (!name || !email || !password ) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }
    const existingAdmin= await Admin.findOne({email})
    if(existingAdmin){
      res.status(400)
      throw new Error("email has already been used")
    }else{
        const admin=new Admin({
            name,
            email,
            password
        })
        await admin.save()
        const token=generateToken(admin._id)
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires:new Date(Date.now()+1000*86400),
            sameSite:"lax",
            secure:false
        
          })
          res.status(201).json({
            admin,
            token
          });
    }
}))

router.post('/login',asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(400)
        throw new Error("please add email and password")
    }
    const admin=await Admin.findOne({email})
    if(!admin){
        res.status(400)
        throw new Error("Admin not found please sign up")
    }
    const correctPassword=await bcrypt.compare(password,admin.password)
    const token=generateToken(admin._id)
    if(admin && correctPassword){
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires:new Date(Date.now()+1000*86400),
            sameSite:"lax",
            secure:false
        
        })
        const {_id,name,email}=admin
        res.status(200).json({
            _id,
            name,
            email,
            token
        })
    }else{
        res.status(400)
        throw new Error("invalid email or password")
      } 
}))

router.get('/logout',asyncHandler(async(req,res,next)=>{
    res.cookie("token","",{
      path:'/',
      httpOnly:true,
      expires:new Date(0),
      sameSite:"none",
      secure:true
    }) 
    return res.status(200).json({
      message:"successfully logged out"
    })
  }))

module.exports=router