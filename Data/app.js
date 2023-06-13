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

const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')

const Farmer=require('./models/farmer')
const Customer=require('./models/customer')
const MarketData=require('./models/market')

const farmerRoutes=require('./routes/farmer')
const marketRoutes=require('./routes/market')
const customerRoutes=require('./routes/customer')

const app = express();
const PORT=process.env.PORT || 8000
const sessionConfig={
  secret:'thisshouldbeasecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
     httpOnly:true,
     expires:Date.now()+1000*60*60*24*7,
     maxAge:1000*60*60*24*7
  }
  
}
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use('farmer', new LocalStrategy(Farmer.authenticate()));
passport.use('customer', new LocalStrategy(Customer.authenticate()));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  let foundUser = null;
  Farmer.findById(id)
    .then(farmer => {
      if (farmer) {
        foundUser = farmer;
        return Promise.resolve(farmer);
      } else {
        return Customer.findById(id);
      }
    })
    .then(customer => {
      if (customer) {
        foundUser = customer;
        return Promise.resolve(customer);
      } else {
        return Promise.reject(new Error('User not found'));
      }
    })
    .then(user => {
      done(null, foundUser);
    })
    .catch(err => {
      done(err, null);
    });
});



// 
// "mongodb://127.0.0.1:27017/final"

mongoose
  .connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
    console.log("CONNECTED");
  })
  .catch((e) => {
    console.log(e.message);
  });

  app.use('/farmer',farmerRoutes)
  app.use('/market',marketRoutes)
  app.use('/customer',customerRoutes)


  app.get("/", (req, res) => {
    res.send("Home Page");
  });
  app.all('*',(req,res,next)=>{
  next(new ExpressError("page not found",404))
  })
  app.use((err,req,res,next)=>{
    const {statusCode=500,message="something went wrong"}=err
    res.status(statusCode).send(message)
  })
 