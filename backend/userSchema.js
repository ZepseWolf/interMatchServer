const mongoose = require('mongoose') ;


var UserSchema = mongoose.model('UserSchema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    _id: { 
        type: String,
        required : true
    },
    email : { 
        type: String,
        required : true
    },
    username : { 
        type: String,
        required : true
    },
    password : { 
        type: String,
        required : true
    },
    user_type: {
        type: String,
        required : true
    },
    creation_dt: {
        type: String,
        default: Date.now()
    },
    num_of_login: {
        type: Number,
        default: 1
    }
    
    // to add  information of the user 
});

module.exports = {UserSchema};