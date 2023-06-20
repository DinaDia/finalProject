const express = require("express");
const router = express.Router();
const geolib = require("geolib");
const mongoose = require("mongoose");
const axios = require("axios");
const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')



const Farmer = require("../models/farmer");
const MarketData = require("../models/market");
const Customer = require("../models/customer");
const AgriSupplier = require("../models/agriSupplier");
const Token = require("../models/farmerTokenModel"); 

const { geocode, isFarmerLoggedIn } = require("../middleware");
const sendEmail = require("../utils/sendEmail");


const generateToken=(id)=>{
  return jwt.sign({id},process.env.jwtSecret,{expiresIn:'1d'})
}
router.post('/signup',asyncHandler(async(req,res)=>{
  const { name, email, location, password ,products} = req.body;
  if (!name || !email || !password || !location || !products) {
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
      const url = `http://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;// Asynchronously calculate the driving distance between two locations
      
      const response = await axios.get(url); // Make a GET request to the routing service API

      const route = response.data.routes[0];// Extract the route distance from the response

      return route.distance; // Distance in meters
    }
    // Iterate over all markets and their locations
    for (const market of markets) {
      for (const loc of market.locations) {
        const destination = {
          latitude: loc.location.coordinates[0],
          longitude: loc.location.coordinates[1],
        };
        const distance = await calculateRoutingDistance(
          { latitude: lat, longitude: lng },
          destination
        );
        distances[`${market.name}-${loc.name}`] = distance;
      }
    }
  // Create a new farmer with the provided information
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
      products
    });
    
    await farmer.save()
    // Generate a token for the farmer
    const token=generateToken(farmer._id)
    res.cookie("token",token,{
      path:'/',
      httpOnly:true,
      expires:new Date(Date.now()+1000*86400),
      sameSite:"lax",
      secure:false
  
    })
    // Send the created farmer's information in the response
    const{_id,name,email,marketDistances}=farmer
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

router.put('/updateProfile',isFarmerLoggedIn,asyncHandler(async(req,res,next)=>{
  const farmer = await Farmer.findById(req.user._id);
  if(farmer){
    const{_id,name,email,location}=farmer
    farmer.email=email
    farmer.name=req.body.name || name
    farmer.location=req.body.location || location //update all the market distances
    const updatedFarmer=await farmer.save()
    res.status(200).json({
      _id:updatedFarmer._id,
      name:updatedFarmer.name,
      email,
      location:updatedFarmer.location,
    })
  }else{
    res.status(404)
    throw new Error("farmer not found,please sign up")
  }
}))
router.put('/changePassword',isFarmerLoggedIn,asyncHandler(async(req,res,next)=>{
  const farmer = await Farmer.findById(req.user._id);
  if(!farmer){
    res.status(404)
    throw new Error("farmer not found,please sign up")
  }
  const {oldPassword,password}=req.body
  if(!oldPassword || !password){
    res.status(400)
    throw new Error("please add the old and the new password")
}
const correctPassword=await bcrypt.compare(oldPassword,farmer.password)
if(correctPassword){
  farmer.password=password
  await farmer.save()
  res.status(200).json("password change successful")
}else{
  res.status(400)
    throw new Error("incorrect old password")
}
}))
router.post('/forgotPassword',asyncHandler(async(req,res)=>{
  const {email}=req.body
  const farmer=await Farmer.findOne({email})
  if(!farmer){
    res.status(404)
    throw new Error("farmer does not exist")
  }
  let token=await Token.findOne({id:farmer._id})
  if (token){
    await token.deleteOne()
  }
  let resetToken=crypto.randomBytes(32).toString("hex")+farmer._id
  const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex")
  await new Token({
    farmerId:farmer._id,
    token:hashedToken,
    createdAt:Date.now(),
    expiresAt:Date.now()+(30*60*1000)
  }).save()
  const resetUrl=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
  const message=`<h2>hello ${farmer.name}</h2>
  <p>please use the url below to reset your password
  </p>
  <p>this reset link will expire in 30 minutes
  </p>
  
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

  <p>regards</p>`
  const subject="password reset request"
  const send_to=farmer.email
  const sent_from=process.env.EMAIL_USER
  try{
    await sendEmail(subject,message,send_to,sent_from)
    res.status(200).json({success:true,message:"reset email sent"})
  }catch(e){
    res.status(500)
    throw new Error("email not sent,please try again")
  }

}))
router.put('/resetPassword/:resetToken',asyncHandler(async(req,res,next)=>{
  const {password}=req.body
  const {resetToken}=req.params
  const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex")
  const farmerToken=await Token.findOne({
    token:hashedToken,
    expiresAt:{$gt:Date.now()}
  })

  if(!farmerToken){
    res.status(404)
    throw new Error("invalid or expired token")
  }
  const farmer=await Farmer.findOne({_id:farmerToken.farmerId})
  farmer.password=password
  await farmer.save()
  res.status(200).json({
    message:"password reset successful,please login"
  })



}))
router.post("/postProduct", isFarmerLoggedIn, async (req, res, next) => {
  const { type, quantity, price } = req.body;
  const farmer = await Farmer.findById(req.user._id);
  farmer.productListing.push({ type, quantity, price });
  await farmer.save();
  res.status(201).json({ message: "Product listed for sale successfully" });
});

router.get("/marketdata",isFarmerLoggedIn, async (req, res) => {
  const farmer = req.user;
  // Retrieve all market data
  const marketData = await MarketData.find();
   // Retrieve query parameters for product name and quantity
  const productName = req.query.productName;
  const quantity = req.query.quantity;
  if (productName && quantity) {
    // Find the selected product in the market data based on the name attribute
    const selectedProduct = marketData.find(product => product.name === productName);

    if (!selectedProduct) {
      // Handle case when the product is not found
      return res.status(400).json({ error: "Product not found" });
    }
    // Calculate potential profits for each location of the selected product
    const potentialProfits = selectedProduct.locations.map(location => {
      const marketName = location.name;
       // Get the market distance from the farmer's marketDistances object
      const marketDistance = req.user.marketDistances.get(`${selectedProduct.name}-${marketName}`)/1000;
      if(quantity<25){
        const transportationCost =  marketDistance;
        const qtyTransport=0
        const marketPrice = location.price;
        const potentialProfit = (marketPrice  * quantity)- (transportationCost+qtyTransport);
        return {
          product: selectedProduct.name,
          marketplace: marketName,
          price:location.price,
          profit: potentialProfit,
        };
      }else if(quantity<500){
        const transportationCost=marketDistance;
        const qtyTransport=0.5*transportationCost
        const marketPrice = location.price;
        const potentialProfit = (marketPrice  * quantity)- (transportationCost+qtyTransport);
        return {
          product: selectedProduct.name,
          marketplace: marketName,
          price:location.price,
          profit: potentialProfit,
        };
      }else if(quantity<6000){
        const transportationCost=marketDistance;
        const qtyTransport=0.9*transportationCost
        const marketPrice = location.price;
        const potentialProfit = (marketPrice  * quantity)- (transportationCost+qtyTransport);
        return {
          product: selectedProduct.name,
          marketplace: marketName,
          price:location.price,
          profit: potentialProfit,
        };
      }
      else{
        const transportationCost=marketDistance;
        const qtyTransport=0.61*transportationCost
        const marketPrice = location.price;
        const potentialProfit = (marketPrice  * quantity)- (transportationCost+qtyTransport);
        return {
          product: selectedProduct.name,
          marketplace: marketName,
          price:location.price,
          profit: potentialProfit,
        };
      }
    });
    potentialProfits.sort((a, b) => b.profit - a.profit);

    // Send the potential profits as a JSON response
    return res.status(200).json({ data: potentialProfits });
  }
  marketData.forEach(market => {
    market.locations.sort((a, b) => {
      const distanceA = farmer.marketDistances.get(`${market.name}-${a.name}`);
      const distanceB = farmer.marketDistances.get(`${market.name}-${b.name}`);
      return distanceA - distanceB;
    });
  });
  res.status(200).json({ data:marketData});
});
router.get('/postedMaterials',isFarmerLoggedIn,asyncHandler(async(req,res,next)=>{
  const suppliers = await AgriSupplier.find();
    const materials = suppliers.flatMap((supplier) => supplier.materialListing);
    res.status(200).json({ data: materials })
}))
module.exports = router;
