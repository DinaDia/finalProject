const express=require('express')
const router = express.Router();

const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')


const MarketData=require('../models/market')

const {geocode,isLoggedIn}=require('../middleware')

router.post("/addmarket",catchAsync(async (req, res, next) => {
    const { name, location, price } = req.body;
  
    let marketData = await MarketData.findOne({ name });
  
    if (marketData) {
      // Existing marketData found
      const existingLocation = marketData.locations.find(
        (loc) => loc.name === location
      );
  
      if (existingLocation) {
        // Update existing location price
        existingLocation.price = price;
      } else {
          const geocodeResult = await geocode(location);
            const { lat, lng } = geocodeResult;
            marketData.locations.push({
              name: location,
              price,
              location: { type: 'Point', coordinates: [lat, lng] },
            });
        }
    }
     else {
      // No existing marketData found, create a new instance
        const geocodeResult = await geocode(location);
          const { lat, lng } = geocodeResult;
          marketData = new MarketData({
            name,
            locations: [{
              name: location,
              price,
              location: { type: 'Point', coordinates: [lat, lng] },
            }],
          });
    }
      await marketData.save();
   res.status(201).json(marketData); // Uncomment this for React response
    // res.redirect("/marketdata");
  }));

  module.exports=router