const mongoose = require('mongoose') ;
const {ObjectID}  = require('mongodb');


var CompanySchema = mongoose.model('CompanySchema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    _id: { 
        type: String,
        required : true
    },
    user_type: {
        type: String,
        default : "Company"
    },
    company_name:{
        type: String
    },
    bio:{
        type: String
    },
    address: {
        type: String
    },
    phone_no:{
        type: String
    },
    company_type:{
        type: String
    },
    //Embedded sub-document Start
    potential_employee:[{
        //we make this using our algorith
        _id: { 
            type: String,
            required : false
        },
        matched_date : {
            type: String,
            default:Date.now()
        },
        employee_id: String,// check potentional_jobs' matched_date for time aspect
        job_id:String
    }],
    matched_employee:[{
        //Once both accept we create this 
        _id: { 
            type: String,
            required : false
        },
        matched_date : {    
            type: String,
            default:Date.now()
        },
        employee_id: String,
        job_id:String 
    }],
    job_position:[{
        _id: { 
            type: String,
            required : false
        },
        job_id: { 
            type: String,
        },
        title: String,
        description: String,
        start_date: String,
        end_date: String,
        company_id: String,// not needed
        specialization: String,
        created_date:{
            type: String,
            default:Date.now()
        },
        deadline: String,
        require_skills: String,
        require_trait_needs:Array,
        require_trait_personality:Array, 
        require_trait_values:Array,  
    }],
    
    
    //Sub doc end
    
    // to add  information of the user 
});

module.exports = {CompanySchema};
