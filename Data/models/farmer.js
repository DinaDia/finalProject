const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bcrypt=require('bcryptjs')

const FarmerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  location:{
    name:{
      type: String,
        required: true,
    },
    type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
  },
  marketDistances: {
    type: Map,
    of: Number,
    default: {},
  },
  products: [{
    name: { type: String, required: true },
  }],
  productListing: [
    {
      type: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      // Additional product details as needed
    },
  ],
  password:{
    type:String,
    required:true
  }
},{
  timestamps:true
});

FarmerSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    return next()
  }
  const salt=await bcrypt.genSalt(10)
  const hashed=await bcrypt.hash(this.password,salt)
  this.password=hashed
  next()
})

// Create a geospatial index on the location field
FarmerSchema.index({ location: '2dsphere' });

const Farmer = mongoose.model('Farmer', FarmerSchema);
module.exports = Farmer;