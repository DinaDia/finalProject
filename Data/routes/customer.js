const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Customer = require("../models/customer");
const MarketData = require("../models/market");

const { geocode,isLoggedIn} = require("../middleware");

router.post("/signup", async (req, res, next) => {
  const { firstName, lastName, email, location, username, password } = req.body;
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
  const customer = new Customer({
    firstName,
    lastName,
    email,
    username,
    location: {
      name: location,
      type: "Point",
      coordinates: [lng, lat],
    },
    marketDistances: distances,
  });

  const registeredCustomer = await Customer.register(customer, password);
  // const {_id,marketDistances}=registeredFarmer
  res.status(201).json({
    registeredCustomer,
  });

  req.login(registeredCustomer, (err) => {
    if (err) return next(err);
    // res.redirect("/marketdata");
    // res.status(200).json({ success: true, message: "Farmer registered successfully" });
  });
});

router.post("/login",
  passport.authenticate("customer", {
    failureRedirect: "/farmer/login",
    keepSessionInfo: true,
  }),
  async (req, res, next) => {
    const customer = await Customer.findById(req.user._id);
    res.status(200).json({ customer });
  }
);
router.get("/getCustomer", isLoggedIn, async (req, res, next) => {
  const customer = await Customer.findById(req.user._id);
  res.status(200).json({ customer });
});
router.get('/logout',(req,res,next)=>{
    req.session.passport=null
    res.status(200).json({
      message:"successfully logged out"
    })
    
    // res.redirect('/')
  })

module.exports = router;
