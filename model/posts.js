const mongoose = require('mongoose')
const Post = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Usersdata_Twitter'
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type: String,
        required:true,
    },
    likes:{
        type:Number,
        default:0,
    },
},
{collection:'Postdata_Twitter'})
const model=mongoose.model('Postdata_Twitter',Post)
module.exports=model;