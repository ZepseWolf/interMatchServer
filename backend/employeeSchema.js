const mongoose = require('mongoose') ;


var EmployeeSchema = mongoose.model('EmployeeSchema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
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
        default : "Employee"
    },
    interactivity : {    
        status : {
            interestedCompany: {
                id: String,
                date: Date
            },
            connectedCompany:{
                id: String,
                status: String,
                date: Date
            }
        }
    },
    profile:{
        
    },
    //Embedded sub-document Start

    //Sub doc end
    creation_dt: {
        type: String,
        default: Date.now()
    }
    // to add  information of the user 
});

module.exports = {EmployeeSchema};
