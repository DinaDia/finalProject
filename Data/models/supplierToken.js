const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const TokenSchema=new Schema({
    supplierId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"agriSupplier"
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
const Token=mongoose.model("SupplierToken",TokenSchema)
module.exports=Token