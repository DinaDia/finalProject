const express=require('express')
const router = express.Router();
const axios = require("axios");

const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')


const MarketData=require('../models/market')
const MarketStore=require('../models/marketStore')
const Farmer=require('../models/farmer')
const Customer=require('../models/customer')

const {geocode,isLoggedIn,isAdmin}=require('../middleware')
async function calculateRoutingDistance(origin, destination) {
  const url = `http://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const response = await axios.get(url);
  const route = response.data.routes[0];
  return route.distance; // Distance in meters
}
router.post("/addmarket",isAdmin,(async (req, res, next) => {
    const { name, location, price } = req.body;
    const store=new MarketStore({name,location,price})
    await store.save()
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
            const farmers = await Farmer.find({});
            for (const farmer of farmers) {
              const farmerLocation = farmer.location.coordinates;
              const destination = {
                latitude: lat,
                longitude: lng,
              };
              const distance = await calculateRoutingDistance(
                { latitude: farmerLocation[1], longitude: farmerLocation[0] },
                destination
              );
              farmer.marketDistances.set(`${name}-${location}`, distance);
              await farmer.save();
            }
            const customers = await Customer.find({});
            for (const customer of customers) {
              const customerLocation = customer.location.coordinates;
              const destination = {
                latitude: lat,
                longitude: lng,
              };
              const distance = await calculateRoutingDistance(
                { latitude: customerLocation[1], longitude: customerLocation[0] },
                destination
              );
              customer.marketDistances.set(`${name}-${location}`, distance);
              await customer.save();
            }
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
          const farmers = await Farmer.find({});
          for (const farmer of farmers) {
            const farmerLocation = farmer.location.coordinates;
            const destination = {
              latitude: lat,
              longitude: lng,
            };
            const distance = await calculateRoutingDistance(
              { latitude: farmerLocation[1], longitude: farmerLocation[0] },
              destination
            );
            farmer.marketDistances.set(`${name}-${location}`, distance);
            await farmer.save();
          }
          const customers = await Customer.find({});
          for (const customer of customers) {
            const customerLocation = customer.location.coordinates;
            const destination = {
              latitude: lat,
              longitude: lng,
            };
            const distance = await calculateRoutingDistance(
              { latitude: customerLocation[1], longitude: customerLocation[0] },
              destination
            );
            customer.marketDistances.set(`${name}-${location}`, distance);
            await customer.save();
          }
    }
      await marketData.save();


   res.status(201).json(marketData);
  }));

  module.exports=router