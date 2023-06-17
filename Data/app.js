const express = require("express");
const mongoose = require("mongoose");
const dotenv=require('dotenv').config()
const path = require("path");
const methodOverride = require("method-override");
const session=require('express-session')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const flash=require('connect-flash')
const Geocoder = require('nominatim-geocoder');
const geolib=require('geolib')
const axios = require('axios');
const cors=require('cors')
const cookieParser=require('cookie-parser')
const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')


const Farmer=require('./models/farmer')
const Customer=require('./models/customer')
const MarketData=require('./models/market')

const farmerRoutes=require('./routes/farmer')
const marketRoutes=require('./routes/market')
const customerRoutes=require('./routes/customer')
const adminRoutes=require('./routes/admin')
const supplierRoutes=require('./routes/agriSupplier')

const app = express();
const PORT=process.env.PORT || 8000

app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


mongoose
  .connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTED");
  })
  .catch((e) => {
    console.log(e.message);
  });

  app.use('/farmer',farmerRoutes)
  app.use('/market',marketRoutes)
  app.use('/customer',customerRoutes)
  app.use('/admin',adminRoutes)
  app.use('/supplier',supplierRoutes)


  app.get("/", (req, res) => {
    res.send("Home Page");
  });
  app.all('*',(req,res,next)=>{
  next(new ExpressError("page not found",404))
  })
  app.use((err,req,res,next)=>{
    const {statusCode=500,message="something went wrong"}=err
    res.status(statusCode).json(message)
  })
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });