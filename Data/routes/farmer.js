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

const { geocode, isFarmerLoggedIn } = require("../middleware");

const generateToken=(id)=>{
  return jwt.sign({id},process.env.jwtSecret,{expiresIn:'1d'})
}
router.post('/signup',asyncHandler(async(req,res)=>{
  const { name, email, location, password } = req.body;
  if (!name || !email || !password || !location) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  
  const existingFarmer= await Farmer.findOne({email})
  if(existingFarmer){
    res.status(400)
    throw new Error("email has already been used")
  }else{
    const geocodeResult = await geocode(location);
    const { lat, lng } = geocodeResult;
    const markets = await MarketData.find({});
    const distances = {};
    async function calculateRoutingDistance(origin, destination) {
      const url = `http://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
      const response = await axios.get(url);
      const route = response.data.routes[0];
      return route.distance; // Distance in meters
    }
    for (const market of markets) {
      for (const location of market.locations) {
        const destination = {
          latitude: location.location.coordinates[0],
          longitude: location.location.coordinates[1],
        };
        const distance = await calculateRoutingDistance(
          { latitude: lat, longitude: lng },
          destination
        );
        distances[`${market.name}-${location.name}`] = distance;
      }
    }
  
    const farmer = new Farmer({
      name,
      password,
      email,
      location: {
        name: location,
        type: "Point",
        coordinates: [lng, lat],
      },
      marketDistances: distances,
    });
    
    await farmer.save()
    const token=generateToken(farmer._id)
    // console.log(token)
    res.cookie("token",token,{
      path:'/',
      httpOnly:true,
      expires:new Date(Date.now()+1000*86400),
      sameSite:"lax",
      secure:false
  
    })
    const{_id,name,location,email,marketDistances}=farmer
    res.status(201).json({
      _id,
      name,
      location,
      email,
      marketDistances,
      token
    });
  }
}))
// router.get('/cookies', (req, res) => {
//   // Retrieve the token cookie
//   const token = req.cookies.token;

//   // Use the token as needed
//   // console.log('Token:', token);
//   res.json(token)

//   // Other logic for the cookies page
//   // ...
// });
router.post('/login',asyncHandler(async(req,res)=>{
  const {email,password}=req.body
  if(!email||!password){
    res.status(400)
    throw new Error("please add email and password")
  }
  const farmer=await Farmer.findOne({email})
  if(!farmer){
    res.status(400)
    throw new Error("User not found please sign up")
  }
  const correctPassword=await bcrypt.compare(password,farmer.password)
  const token=generateToken(farmer._id) 
  if(farmer && correctPassword){
    res.cookie("token",token,{
      path:'/',
      httpOnly:true,
      expires:new Date(Date.now()+1000*86400),
      sameSite:"lax",
      secure:false
  
    })
    const{_id,name,email,location,marketDistances}=farmer
    res.status(200).json({
      _id,
      name,
      email,
      location,
      marketDistances,
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
    sameSite:"lax",
    secure:false
  }) 
  return res.status(200).json({
    message:"successfully logged out"
  })
}))

router.get("/getFarmer",isFarmerLoggedIn,asyncHandler(async (req, res) => {
  const farmer = await Farmer.findById(req.user._id);
  // console.log(farmer)
  if(farmer){
    const{_id,name,email,location,marketDistances}=farmer
    res.status(200).json({
      _id,
      name,
      email,
      location,
      marketDistances,
    })
  }else{
    res.status(400)
    throw new Error("Farmer Not Found")
  }
  
 
}));


router.post("/postProduct", isFarmerLoggedIn, async (req, res, next) => {
  const { type, quantity, price } = req.body;
  const farmer = await Farmer.findById(req.user._id);
  farmer.productListing.push({ type, quantity, price });
  await farmer.save();
  res.status(201).json({ message: "Product listed for sale successfully" });
});
router.get("/logout", (req, res, next) => {
  req.session.passport = null;
  res.status(200).json({
    message: "successfully logged out",
  });

  // res.redirect('/')
});

router.get("/marketdata",isFarmerLoggedIn, async (req, res) => {
  const farmer = req.user;
  const marketData = await MarketData.find();
  marketData.forEach(market => {
    market.locations.sort((a, b) => {
      const distanceA = farmer.marketDistances.get(`${market.name}-${a.name}`);
      const distanceB = farmer.marketDistances.get(`${market.name}-${b.name}`);
      return distanceA - distanceB;
    });
  });
  res.status(200).json({ data:marketData});
});
module.exports = router;
