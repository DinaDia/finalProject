const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");
const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Customer = require("../models/customer");
const MarketData = require("../models/market");
const Farmer = require("../models/farmer");
const Token = require("../models/customerTokenModel"); 

const { geocode, isCustomerLoggedIn } = require("../middleware");
const sendEmail = require("../utils/sendEmail");

const generateToken=(id)=>{
  return jwt.sign({id},process.env.jwtSecret,{expiresIn:'1d'})
}

router.post("/signup",asyncHandler(async(req,res)=>{
  const { name, email, location, password } = req.body;
  if (!name || !email || !password || !location) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  const existingCustomer=await Customer.findOne({email})
  if(existingCustomer){
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
    const customer=new Customer({
      name,
      password,
      email,
      location: {
        name: location,
        type: "Point",
        coordinates: [lng, lat],
      },
      marketDistances: distances,
    })
    await customer.save()
    const token=generateToken(customer._id)
    res.cookie("token",token,{
      path:'/',
      httpOnly:true,
      expires:new Date(Date.now()+1000*86400),
      sameSite:"lax",
      secure:false
  
    })
    res.status(201).json({
      customer,
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
  const customer=await Customer.findOne({email})
  if(!customer){
    res.status(400)
    throw new Error("User not found please sign up")
  }
  const correctPassword=await bcrypt.compare(password,customer.password)
  const token=generateToken(customer._id) 
  if(customer && correctPassword){
    res.cookie("token",token,{
      path:'/',
      httpOnly:true,
      expires:new Date(Date.now()+1000*86400),
      sameSite:"lax",
      secure:false
  
    })
    const{_id,name,email,location,marketDistances}=customer
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

router.get("/getCustomer",isCustomerLoggedIn,asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user._id);
  if(customer){
    const{_id,name,email,location,marketDistances}=customer
    res.status(200).json({
      _id,
      name,
      email,
      location,
      marketDistances,
    })
  }else{
    res.status(400)
    throw new Error("customer Not Found")
  }
}));
router.put('/updateProfile',isCustomerLoggedIn,asyncHandler(async(req,res,next)=>{
  const customer = await Customer.findById(req.user._id);
  if(customer){
    const{_id,name,email,location}=customer
    customer.email=email
    customer.name=req.body.name || name
    customer.location=req.body.location || location //update all the market distances
    const updatedCustomer=await customer.save()
    res.status(200).json({
      _id:updatedCustomer._id,
      name:updatedCustomer.name,
      email,
      location:updatedCustomer.location,
    })
  }else{
    res.status(404)
    throw new Error("customer not found,please sign up")
  }
}))

router.put('/changePassword',isCustomerLoggedIn,asyncHandler(async(req,res,next)=>{
  const customer = await Customer.findById(req.user._id);
  if(!customer){
    res.status(404)
    throw new Error("customer not found,please sign up")
  }
  const {oldPassword,password}=req.body
  if(!oldPassword || !password){
    res.status(400)
    throw new Error("please add the old and the new password")
}
const correctPassword=await bcrypt.compare(oldPassword,customer.password)
if(correctPassword){
  customer.password=password
  await customer.save()
  res.status(200).json("password change successful")
}else{
  res.status(400)
    throw new Error("incorrect old password")
}
}))

router.post('/forgotPassword',asyncHandler(async(req,res)=>{
  const {email}=req.body
  const customer=await Customer.findOne({email})
  if(!customer){
    res.status(404)
    throw new Error("customer does not exist")
  }
  let token=await Token.findOne({id:customer._id})
  if (token){
    await token.deleteOne()
  }
  let resetToken=crypto.randomBytes(32).toString("hex")+customer._id
  const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex")
  await new Token({
    customerId:customer._id,
    token:hashedToken,
    createdAt:Date.now(),
    expiresAt:Date.now()+(30*60*1000)
  }).save()
  const resetUrl=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
  const message=`<h2>hello ${customer.name}</h2>
  <p>please use the url below to reset your password
  </p>
  <p>this reset link will expire in 30 minutes
  </p>
  
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

  <p>regards</p>`
  const subject="password reset request"
  const send_to=customer.email
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
  const customerToken=await Token.findOne({
    token:hashedToken,
    expiresAt:{$gt:Date.now()}
  })

  if(!customerToken){
    res.status(404)
    throw new Error("invalid or expired token")
  }
  const customer=await Farmer.findOne({_id:customerToken.customerId})
  customer.password=password
  await customer.save()
  res.status(200).json({
    message:"password reset successful,please login"
  })



}))
router.get("/marketdata",isCustomerLoggedIn, async (req, res) => {
  // Retrieve all market data documents from the database
  const customer=req.user
  const marketData = await MarketData.find();
    // Sort the locations within each market data document based on the distance from the farmer's location
    marketData.forEach(market => {
      market.locations.sort((a, b) => {
        const distanceA = customer.marketDistances.get(`${market.name}-${a.name}`);
        const distanceB = customer.marketDistances.get(`${market.name}-${b.name}`);
        return distanceB - distanceA;
      });
    });
    // Send the sorted market data as a JSON response
    res.status(200).json({ data: marketData });  
})

router.get("/posts",isCustomerLoggedIn, asyncHandler(async (req, res, next) => {
  const { productName } = req.query;
  const { coordinates } = req.user.location;
  // res.json(coordinates)
  const query = {
    productListing: {
      $elemMatch: { type: productName },
    },
  };
  const farmers = await Farmer.find(query).exec();
  // res.json(farmers)
  const farmersWithDistances = [];
  async function calculateRoutingDistance(origin, destination) {
    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
      const response = await axios.get(url);
      const route = response.data.routes[0];
      return route.distance; // Distance in meters
    } catch (error) {
      // Handle distance calculation error
      console.error("Error calculating routing distance:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
  for (const farmer of farmers) {
    const farmerCoordinates = farmer.location.coordinates;

    const distance = await calculateRoutingDistance(
      { latitude: coordinates[1], longitude: coordinates[0] },
      { latitude: farmerCoordinates[1], longitude: farmerCoordinates[0] }
    );
    const product = farmer.productListing.find(p => p.type === productName);
    farmersWithDistances.push({
      farmer,
      distance,
      price:product.price
    });
  }
  farmersWithDistances.sort((a, b) => a.distance - b.distance);
  const response = farmersWithDistances.map(({ farmer, distance,price}) => ({
    name:farmer.name,
    email:farmer.email,
    price,
    distance,
  }));
  res.status(200).json({product: productName,data:response})
}));

module.exports = router;
