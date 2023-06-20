const mongoose=require('mongoose')
const fs = require('fs');
const csv = require('csv-parser');
const Schema=mongoose.Schema


const MarketSchema=new Schema({
    name: {
      type: String,
      required: true,
    },
    location:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        required: true,
      },
    price:{
        type:Number,
        required:true
    },
})
const filePath = 'file.csv';
const MarketStore = mongoose.model('MarketStore', MarketSchema);
module.exports = MarketStore;