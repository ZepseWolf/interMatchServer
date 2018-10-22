const mongoose = require('mongoose') ;


var CompanySchema = mongoose.model('CompanySchema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    email : { 
        type: String
    },
    username : { 
        type: String
    },
    password : { 
        type: String
    },
    typeOfUser: {
        type: String,
        default : "Company"
    },
    interactivity : {    
        status : {
            interestedEmployee: {
                id: String,
                status: String,
                date: Date
            },
            interestedCompany: {
                id: String,
                status: String,
                date: Date
            }
        }   
    },
    //Embedded sub-document Start

    //Sub doc end
    creation_dt: {
        type: String,
        default: Date.now()
    }
    // to add  information of the user 
});

module.exports = {CompanySchema};
