const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const bcrypt=require('bcryptjs')

const SupplierSchema = new Schema({
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
    materials: [{
      name: { type: String, required: true },
    }],
    materialListing: [
      {
        name: {
          type: String,
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
  SupplierSchema.pre("save",async function(next){
    if(!this.isModified("password")){
      return next()
    }
    const salt=await bcrypt.genSalt(10)
    const hashed=await bcrypt.hash(this.password,salt)
    this.password=hashed
    next()
  })

  SupplierSchema.index({ location: '2dsphere' });

const AgriSupplier = mongoose.model('AgriSupplier', SupplierSchema);
module.exports=AgriSupplier;