const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const FarmerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
});

// Add the passport-local-mongoose plugin to the FarmerSchema
FarmerSchema.plugin(passportLocalMongoose);

// Create a geospatial index on the location field
FarmerSchema.index({ location: '2dsphere' });

const Farmer = mongoose.model('Farmer', FarmerSchema);
module.exports = Farmer;