const Geocoder = require("nominatim-geocoder");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Customer = require("./models/customer");
const Farmer = require("./models/farmer");
const Admin = require("./models/admin");
const Supplier = require("./models/agriSupplier");
const geocoder = new Geocoder();

module.exports.geocode = async (address) => {
  const response = await geocoder.search({ q: address, limit: 1 });
  if (response.length > 0) {
    const result = response[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
  } else {
    return null;
  }
};
module.exports.isFarmerLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not Authorized,please login");
    }
    const verified = jwt.verify(token, process.env.jwtSecret);
    const farmer = await Farmer.findById(verified.id).select("-password");
    if (!farmer) {
      res.status(401);
      throw new Error("user not found");
    }
    req.user = farmer;
    next();
  } catch (e) {
    res.status(401);
    throw new Error("Not Authorized,please login");
  }
});

module.exports.isCustomerLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not Authorized,please login");
    }
    const verified = jwt.verify(token, process.env.jwtSecret);
    const customer = await Customer.findById(verified.id).select("-password");
    if (!customer) {
      res.status(401);
      throw new Error("user not found");
    }
    req.user = customer;
    next();
  } catch (e) {
    res.status(401);
    throw new Error("Not Authorized,please login");
  }
});
module.exports.isSupplierLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not Authorized,please login");
    }
    const verified = jwt.verify(token, process.env.jwtSecret);
    const supplier = await Supplier.findById(verified.id).select("-password");
    if (!supplier) {
      res.status(401);
      throw new Error("user not found");
    }
    req.user = supplier;
    next();
  } catch (e) {
    res.status(401);
    throw new Error("Not Authorized,please login");
  }
});

module.exports.isAdmin=asyncHandler(async(req,res,next)=>{
  try{
    const token=req.cookies.token
    if(!token){
      res.status(401)
      throw new Error("Not Authorized,Please Login");
    }
    const verified=jwt.verify(token,process.env,jwtSecret);
    const admin=await Admin.findById(verified.id).select("-password")
    if(!admin){
      res.status(401);
      throw new Error("You are not an admin")
    }
    req.user=admin
    next()
  }catch(e){
    res.status(401)
    throw new Error("please login")
  }
})