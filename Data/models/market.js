const mongoose=require('mongoose')
const Schema=mongoose.Schema

const MarketDataSchema=new Schema({
  name: {
    type: String,
    required: true,
  },
  locations: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      location: {
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
    },
  ],
})

MarketDataSchema.index({ 'locations.location': '2dsphere' });


const MarketData = mongoose.model('MarketData', MarketDataSchema);
module.exports = MarketData;