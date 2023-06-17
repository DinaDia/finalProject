const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const bcrypt=require('bcryptjs')

const AdminSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

AdminSchema.pre("save",async function(next){
    if(!this.isModified("password")){
      return next()
    }
    const salt=await bcrypt.genSalt(10)
    const hashed=await bcrypt.hash(this.password,salt)
    this.password=hashed
    next()
  })
const Admin=mongoose.model('Admin',AdminSchema)  
module.exports=Admin