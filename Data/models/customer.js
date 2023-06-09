const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
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
  location: {
    name: {
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
  // Add any other fields specific to the customer model
});
CustomerSchema.plugin(passportLocalMongoose)
CustomerSchema.index({ location: '2dsphere' });
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
