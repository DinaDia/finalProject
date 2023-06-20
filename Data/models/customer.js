const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt=require('bcryptjs')

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type:String, 
    required: true
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
  password:{
    type:String,
    required:true
  }
  // Add any other fields specific to the customer model
},{
  timestamps:true
});

CustomerSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    return next()
  }
  const salt=await bcrypt.genSalt(10)
  const hashed=await bcrypt.hash(this.password,salt)
  this.password=hashed
  next()
})
CustomerSchema.index({ location: '2dsphere' });
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
