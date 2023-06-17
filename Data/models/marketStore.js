const mongoose=require('mongoose')
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
    price:{
        type:Number,
        required:true
    }
},{
  timestamps:true
})
  
const MarketStore = mongoose.model('MarketStore', MarketSchema);
module.exports = MarketStore;