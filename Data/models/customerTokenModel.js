const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const TokenSchema=new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"customer"
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
const Token=mongoose.model("CustomerToken",TokenSchema)
module.exports=Token