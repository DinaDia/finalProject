const express = require("express");
const router = express.Router();
const geolib=require('geolib')
const mongoose = require("mongoose");
const passport=require('passport')
const LocalStrategy=require('passport-local')


const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')

const Farmer=require('../models/farmer')
const MarketData=require('../models/market')

const {geocode}=require('../middleware')

router.post("/signup", catchAsync(async (req, res, next) => {
  if(!req.body)throw new ExpressError("Invalid data",400)
  const { firstName, lastName, email, location, username, password } = req.body;

  const geocodeResult = await geocode(location);
    const { lat, lng } = geocodeResult;
    const markets = await MarketData.find({});
    const distances = {};
    markets.forEach((market) => {
      market.locations.forEach((location) => {
        const distance = geolib.getDistance(
          { latitude: lat, longitude: lng },
          { latitude: location.location.coordinates[0], longitude: location.location.coordinates[1] }
        );
        distances[`${market.name}-${location.name}`] = distance;
      });
    });
    const farmer = new Farmer({
      firstName,
      lastName,
      email,
      username,
      location: {
        name:location,
        type: "Point",
        coordinates: [lng, lat],
      }, 
      marketDistances: distances,
    });
    const registeredFarmer = await Farmer.register(farmer, password);
        const {_id,marketDistances}=registeredFarmer
          res.status(201).json({
            _id,firstName,lastName,email,location,marketDistances,password
          })
     

        req.login(registeredFarmer, (err) => {
          if (err) return next(err);
          // res.redirect("/marketdata");
          // res.status(200).json({ success: true, message: "Farmer registered successfully" });
        });
   
}));

router.post('/login',passport.authenticate('local',{failureRedirect:'/farmer/login',keepSessionInfo:true}),async(req,res,next)=>{
const farmer=await Farmer.findById(req.user._id)
res.status(200).json({farmer})
})


module.exports=router