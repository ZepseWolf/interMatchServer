const mongoose = require('mongoose') ;


var Userschema = mongoose.model('Userschema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    username : { 
        type: String
    },
    password : { 
        type: String
    },
    interactivity : {    
        typeOfUser: {
            type: String
        },
        status : {
            type: Boolean,
            default: false 
        }   
    }
    // to add  information of the user 
});

module.exports = {Userschema};
