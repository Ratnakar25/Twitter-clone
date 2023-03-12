const mongoose = require('mongoose')
const User = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    admin:{
        type: String,
        default: "no"
    }
},
{collection:'Usersdata_Twitter'})
const model=mongoose.model('Usersdata_Twitter',User)
module.exports=model;