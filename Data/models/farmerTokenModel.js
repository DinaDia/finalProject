const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const TokenSchema=new Schema({
    farmerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"farmer"
    },
    token:{
        type:String,
        required:true,   
    },
    createdAt:{
        type:Date,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
})
const Token=mongoose.model("Token",TokenSchema)
module.exports=Token