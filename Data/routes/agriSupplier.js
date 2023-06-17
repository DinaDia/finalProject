const express = require("express");
const router = express.Router();
const geolib = require("geolib");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const axios = require("axios");
const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')


const Farmer = require("../models/farmer");
const MarketData = require("../models/market");
const Customer = require("../models/customer");
const AgriSupplier = require("../models/agriSupplier");
const Token = require("../models/supplierToken"); 

const { geocode, isSupplierLoggedIn } = require("../middleware");

const generateToken=(id)=>{
    return jwt.sign({id},process.env.jwtSecret,{expiresIn:'1d'})
  }



  
router.post('/signup',asyncHandler(async(req,res)=>{
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }
    const existingSupplier= await AgriSupplier.findOne({email})
    if(existingSupplier){
      res.status(400)
      throw new Error("email has already been used")
    }else{
        const agriSupplier=new AgriSupplier({
            name,
            email,
            password
        })
        await agriSupplier.save()
        const token=generateToken(agriSupplier._id)
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires:new Date(Date.now()+1000*86400),
            sameSite:"lax",
            secure:false
        
          })
          res.status(201).json({
            agriSupplier,
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
    const agriSupplier=await AgriSupplier.findOne({email})
    if(!agriSupplier){
        res.status(400)
        throw new Error("AgriSupplier not found please sign up")
    }
    const correctPassword=await bcrypt.compare(password,agriSupplier.password)
    const token=generateToken(agriSupplier._id)
    if(agriSupplier && correctPassword){
        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires:new Date(Date.now()+1000*86400),
            sameSite:"lax",
            secure:false
        
        })
        const {_id,name,email}=agriSupplier
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
  router.put('/updateProfile',isSupplierLoggedIn,asyncHandler(async(req,res,next)=>{
    const supplier = await AgriSupplier.findById(req.user._id);
    if(supplier){
      const{_id,name,email,location}=supplier
      supplier.email=email
      supplier.name=req.body.name || name
      supplier.location=req.body.location || location //update all the market distances
      const updatedSupplier=await supplier.save()
      res.status(200).json({
        _id:updatedSupplier._id,
        name:updatedSupplier.name,
        email,
        location:updatedSupplier.location,
      })
    }else{
      res.status(404)
      throw new Error("supplier not found,please sign up")
    }
  })) 
   
router.put('/changePassword',isSupplierLoggedIn,asyncHandler(async(req,res,next)=>{
  const supplier = await AgriSupplier.findById(req.user._id);
  if(!supplier){
    res.status(404)
    throw new Error("supplier not found,please sign up")
  }
  const {oldPassword,password}=req.body
  if(!oldPassword || !password){
    res.status(400)
    throw new Error("please add the old and the new password")
}
const correctPassword=await bcrypt.compare(oldPassword,supplier.password)
if(correctPassword){
  supplier.password=password
  await supplier.save()
  res.status(200).json("password change successful")
}else{
  res.status(400)
    throw new Error("incorrect old password")
}
}))

router.post('/forgotPassword',asyncHandler(async(req,res)=>{
  const {email}=req.body
  const supplier=await AgriSupplier.findOne({email})
  if(!supplier){
    res.status(404)
    throw new Error("supplier does not exist")
  }
  let token=await Token.findOne({id:supplier._id})
  if (token){
    await token.deleteOne()
  }
  let resetToken=crypto.randomBytes(32).toString("hex")+supplier._id
  const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex")
  await new Token({
    supplierId:supplier._id,
    token:hashedToken,
    createdAt:Date.now(),
    expiresAt:Date.now()+(30*60*1000)
  }).save()
  const resetUrl=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
  const message=`<h2>hello ${supplier.name}</h2>
  <p>please use the url below to reset your password
  </p>
  <p>this reset link will expire in 30 minutes
  </p>
  
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

  <p>regards</p>`
  const subject="password reset request"
  const send_to=supplier.email
  const sent_from=process.env.EMAIL_USER
  try{
    await sendEmail(subject,message,send_to,sent_from)
    res.status(200).json({success:true,message:"reset email sent"})
  }catch(e){
    res.status(500)
    throw new Error("email not sent,please try again")
  }

}))
router.post('/postMaterials',isSupplierLoggedIn,asyncHandler(async(req,res,next)=>{
  const { name, price } = req.body;
  const supplier=req.user
  supplier.materialListing.push({ name, price })
  await supplier.save()
  res.status(201).json({ message: "material listed for sale successfully" });
}))
module.exports=router