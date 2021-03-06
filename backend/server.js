const path = require('path');  
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIO = require('socket.io');
const {EmployeeSchema} = require('./employeeSchema.js');// testing
const {CompanySchema} = require('./companySchema.js');
const {JobSchema} = require('./jobSchema.js');
const {UserSchema} = require('./userSchema.js');
const  _ = require('lodash');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var personalityInsights = new PersonalityInsightsV3({
    version: '2017-10-13',
    username: 'e017ffe0-0eec-40b1-9cbc-5f22de364688',
    password: 'vGT2DJsQA3Op',
    url: 'https://gateway.watsonplatform.net/personality-insights/api'
});
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
const router =  express.Router();
const {mongoose} = require('./mongoose');
const {ObjectID}  = require('mongodb');


app.use(express.static(path.join(__dirname,'../dist/project')));
app.use(bodyParser.json());
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'../dist/project/index.html'));
});
// mongoose START--------------------------------------------------------------------------

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Success connected to mongoose.');
});

// mongoose END --------------------------------------------------------------------------
app.post('/register', (req,res)=>{
    var newID = ObjectID.createPk();
    if(req.body.user_type == "Employee"){
        console.log("Employee");
        var user = new EmployeeSchema({
            _id: newID
        });
        var generalUser = new UserSchema({
            _id: newID,
            username : req.body.username,
            password : req.body.password,
            email : req.body.email,
            user_type : req.body.user_type
        });
    }else{
        console.log("Company");
        var user = new CompanySchema({
            _id: newID
        });
        var generalUser = new UserSchema({
            _id: newID,
            username : req.body.username,
            password : req.body.password,
            email : req.body.email,
            user_type : req.body.user_type
        });
    } 

    user.save().then((SpecificData)=>{
        
        generalUser.save().then((allData)=>{
            res.send(allData);
        },(e)=>{ //i doubt that this is the right way to do the error handing XD
            res.status(400).send(e);
        }).catch((err)=>{
            res.send(err);
        });
    },(e)=>{
        res.status(400).send(e);
    }).catch((err)=>{
        res.send(err);
    });

});
app.patch('/feed/:id', (req,res)=>{
    // only display this when it skip first login
    var id = req.params.id;
    var obj;

    
    UserSchema.findById({_id:id}).then((x)=>{
         obj =  x; 
    },(err) =>{
        res.status(400).send(err);
    }).then( ()=>{
        if( obj.user_type == "Employee"){
            function updateEmployee(arr,employeeID){
                console.log("employee update ", arr ,"The id :",employeeID)
                EmployeeSchema.update({_id:employeeID },{$set :  {
                    potentional_jobs:  arr
                }},{new:true}).then();
            };
            function updateCompany(jobID,companyID,employeeID){
                CompanySchema.findOneAndUpdate({_id:companyID},{$push :  {
                    potential_employee:{
                        employee_id: employeeID,
                        job_id: jobID
                    } 
                }}).then();
            };
            EmployeeSchema.findById({_id:id}).then((employeeData)=>{ 
                //TODO 3. matching here
                var matchingCriteria = _.pick(employeeData,['trait_needs','trait_personality','trait_values']);
                var count = 0;
                var objArr = [];
                [matchingCriteria.trait_needs,matchingCriteria.trait_personality,matchingCriteria.trait_values].map(function(objOfTraits){
                 var traitClass = ["require_trait_needs","require_trait_personality","require_trait_values"];
                    objOfTraits.map(function(objs){
                        var obj = {};
                        obj[traitClass[count]+".trait_name"] = objs.trait_name;
                        objArr.push(obj);
                    });
                count++;
                });
                //var matchingCriteria = { trait_needs: [{"trait_name":"Structursdae","trait_rank":1},{"trait_name":"Curiosity","trait_rank":2},{"trait_name":"Stability","trait_rank":3},{"trait_name":"Practicality","trait_rank":4},{"trait_name":"Challenge","trait_rank":5}] };
                JobSchema.find({
                    $or : objArr
                }).then((yourcompanywhowantsyou)=>{ 
                    
                    var listArr = [];
                    var sum = 0 ;                   
                    yourcompanywhowantsyou.forEach(jobList => {  
                        var v = true;
                        
                        var requireTraitClass = ["require_trait_needs","require_trait_personality","require_trait_values"];
                        var traitClass = ["trait_needs","trait_personality","trait_values"];
                        for(var t =0 ; t<3 ;t++){
                            var jobTraits = eval("jobList."+requireTraitClass[t]);
                            var toMatchTraits = eval("matchingCriteria."+traitClass[t]);
                            var ylen = jobTraits.length;
                            var xlen = toMatchTraits.length;
                            for(var y= 0 ;y<jobTraits.length; y++ ){
                                for(var x= 0 ;x <toMatchTraits.length; x++ ){     
                                    if(toMatchTraits[x].trait_name == jobTraits[y].trait_name){
                                        var currentYRank = jobTraits[y].trait_rank;
                                        var currentXRank = toMatchTraits[x].trait_rank;
                                        // y for company , x is for employee 
                                        // why five because the trait of the employees which i used
                                        // watson api to find hence is a fixed amount at 5 and the percentage balancer is (((5+1-ylen)/15)+(10/15). 15 is 5 magic num 
                                        // This below is caculating the need model. divide 3 because 3 traits
                                        
                                        //console.log("X :" ,currentXRank,' Y :',currentYRank);
                                        sum += (((1+ylen)-currentYRank)/(((ylen * ylen) + ylen)/2)* ((1+xlen-currentXRank)/5)/(((6-ylen)/15)+(10/15)))/3;
                                    }  
                                } 
                            }
                        }
                        if (sum >0.60 ){                                  
                            console.log("More then 60%!",jobList._id," is a ",Math.round(sum*100) ,"% matched!");                
                            for(var i = 0 ; i<employeeData.potentional_jobs.length;i++){
                                if(employeeData.potentional_jobs[i].job_id == jobList._id && employeeData.potentional_jobs[i].company_id ==jobList.company_id){
                                    v = false;
                                }
                            }
                            if (v){
                                listArr.push({
                                    job_id: jobList._id,
                                    company_id: jobList.company_id,
                                    employee_id: employeeData._id,
                                });
                            }
                            sum = 0;
                        }
                        else if (sum < 0.60 ){                          
                            console.log('No match > The sum :', sum);
                            sum = 0;
                        }  
                    });
                    if(listArr === undefined || listArr.length == 0){
                        // add array together
                        var companyID = [];
                        for(var i = 0; i<employeeData.potentional_jobs.length;i++){
                            companyID.push({
                                _id : employeeData.potentional_jobs[i].company_id
                            })
                        }
                        CompanySchema.find({$or: companyID}).then((data)=>{
                            console.log("The old data :",data);           
                            res.send(data);
                        })
                        
                       // res.send("Potential jobs for employee and company is already updated!");
                    }else{
                        var c = employeeData.potentional_jobs;
                        var companyCode = "";
                        for(var i = 0; i<listArr.length;i++){
                           c =  c.concat({
                                matched_date: Date.now(),
                                job_id: listArr[i].job_id,
                                company_id: listArr[i].company_id
                            });
                            companyCode =  companyCode.concat(`updateCompany(listArr[${i}].job_id,listArr[${i}].company_id,listArr[${i}].employee_id),`);
                            
                        }
                         var code  = eval(companyCode.slice(0, -1));
                         
                        console.log(listArr);
                        Promise.all([updateEmployee(c,listArr[0].employee_id),code])
                        .then(() =>{
                            var companyID = [];
                            for(var i = 0; i<c.length;i++){
                                companyID.push({
                                    _id : c[i].company_id
                                })
                            }
                            CompanySchema.find({$or: companyID}).then((data)=>{
                                console.log("The New data :",data);
                                res.send(data);
                            })
                        });
                        
                    }               
                });
            },(err) =>{
                res.status(400).send(err);
            });
        }
        else if (obj.user_type == "Company"){
            CompanySchema.findById(req.params.id).then((companySchema)=>{ 
                
                JobSchema.find({$or : companySchema.job_position}).then((jobListByCompany)=>{
                    
                    jobListByCompany.forEach(jobList => {
                        
                        //for each of the job the company listed
                        var count = 0;
                        var objArr = [];
                        [jobList.require_trait_needs,jobList.require_trait_personality,jobList.require_trait_values].map(function(objOfTraits){
                            var traitClass = ["trait_needs","trait_personality","trait_values"];
                            objOfTraits.map(function(objs){
                                var obj = {};
                                obj[traitClass[count]+".trait_name"] = objs.trait_name;
                                objArr.push(obj);
                            });
                        count++;
                        // getting all the traits mapped to compare with database against users (objArr) is the array for compare
                        });
                      
                        EmployeeSchema.find({
                            $or : objArr
                        }).then(possibleEmployee =>{
                            
                            var listArr = [];
                            var sum = 0 ;    
                            console.log(`vvvvvvvvvvvvvvvvThe job list id of possibleEmployee: ${jobList._id}vvvvvvvvvvvvvvvvvv`)
                            possibleEmployee.forEach(toMatchEmployee=>{
                            var v = true;
                               //start matching model
                            console.log(`-------to match Employee id :${toMatchEmployee._id} -------`)
                            var requireTraitClass = ["require_trait_needs","require_trait_personality","require_trait_values"];
                            var traitClass = ["trait_needs","trait_personality","trait_values"];
                            for(var t =0 ; t<3 ;t++){
                                var jobTraits = eval("jobList."+requireTraitClass[t]);
                                var toMatchTraits = eval("toMatchEmployee."+traitClass[t]);
                                var ylen = jobTraits.length;
                                var xlen = toMatchTraits.length;
                                for(var y= 0 ;y<jobTraits.length; y++ ){
                                    for(var x= 0 ;x <toMatchTraits.length; x++ ){     
                                        if(toMatchTraits[x].trait_name == jobTraits[y].trait_name){
                                            var currentYRank = jobTraits[y].trait_rank;
                                            var currentXRank = toMatchTraits[x].trait_rank;
                                            // y for company , x is for employee 
                                            // why five because the trait of the employees which i used
                                            // watson api to find hence is a fixed amount at 5 and the percentage balancer is (((5+1-ylen)/15)+(10/15). 15 is 5 magic num 
                                            // This below is caculating the need model. divide 3 because 3 traits
                                          
                                            //console.log("X :" ,currentXRank,' Y :',currentYRank);
                                            sum += (((1+ylen)-currentYRank)/(((ylen * ylen) + ylen)/2)* ((1+xlen-currentXRank)/5)/(((6-ylen)/15)+(10/15)))/3;
                                        }  
                                    } 
                                }
                                
                            }
                            if (sum >0.60 ){                                  
                                console.log("More then 60%!",jobList._id," is a ",Math.round(sum*100) ,"% matched!");
                                                
                                for(var i = 0 ; i<companySchema.potential_employee.length&&v ;i++){
                                    // check if matched before
                                    for ( var e = 0 ; e< toMatchEmployee.potentional_jobs.length;e++){
                                        //below show job id from employee don't exist in company schema
                                        console.log(toMatchEmployee.potentional_jobs[e].job_id);
                                        if((toMatchEmployee.potentional_jobs[e].job_id == companySchema.potential_employee[i].job_id && companySchema.potential_employee[i].employee_id == toMatchEmployee._id)|| toMatchEmployee.potentional_jobs[e].job_id){
                                            v = false;
                                            console.log("No excute");
                                        }                         
                                    }
                                }
                                if (v){
                                    console.log("Yes excute");
                                    // listArr.push({
                                    //     job_id: jobList._id,
                                    //     company_id: jobList.company_id,
                                    //     employee_id: employeeData._id,
                                    // });
                                }
                                sum = 0;
                            }
                            else if (sum < 0.60 ){                          
                                console.log('No match > The sum :', sum);
                                sum = 0;
                            }  
                            console.log("-----------------------End employee id ---------------");
                            console.log("");
                            });
                            console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv End job id vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
                            
                        })
                        
                    });  
                })
                //res.send({companySchema}); ///website will reply a json for front end to use
            },(err) =>{
                res.status(400).send(err);
            });
        }
        else{
            res.redirect('/');
        }
    });
});

app.get('/login', (req,res)=>{
    // change to login 
    UserSchema.find().then((userSchema)=>{ 
        //compare here, passport js shit here
        //res.send({userSchema});   >> website will return a json for front end to use
    },(err) =>{
        res.status(400).send(err);
    });
});
app.get('/userprofile/:id',(req,res)=>{
    UserSchema.findById({_id: req.params.id}).then((userSchema)=>{ 
        var database = eval(`${userSchema.user_type}Schema`);
        database.findById({_id: req.params.id}).then(result=>{
            res.send(result);
        })
    },(err) =>{
            res.status(400).send(err);
    });
});
app.get('/jobposting/:id',(req,res)=>{
    CompanySchema.findById({_id:req.params.id}, (err,data)=>{
        if(err)
        res.status(404).send(err);

        //how to use > /jobposting/edit/_id/job_position.job_id
        //             /jobposting/add/_id

        res.send({data});
    });
});
app.post('/jobposting/add/:id',(req,res)=>{
    //how to use >> /jobposting/add/_id < company id
    var createdID = ObjectID.createPk();
        var job = new JobSchema({
            _id: createdID,
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            company_id: req.params.id,
            specialization: req.body.specialization,
            deadline: req.body.deadline,
            require_skills: req.body.require_skills,
            require_trait_needs: req.body.require_trait_needs,
            require_trait_personality: req.body.require_trait_personality, 
            require_trait_values: req.body.require_trait_values
        });
        function updateCompany(){
            CompanySchema.findOneAndUpdate({
                _id : req.params.id
            },{$push: {
                job_position: {
                    _id: createdID
                }
            }}).then();
        };
        function addJobList(){
           return job.save().catch((err)=>{
                res.send(err);
            });
        };
        Promise.all([
            updateCompany(),
            addJobList()
        ]).then((data)=>{
            res.send(data);
        });
        
    

    

});
app.patch('/jobposting/edit/:jobID',(req,res)=>{
    //how to use >> /jobposting/edit/job_position.job_id
    //Can look nicer but another time
    JobSchema.findOneAndUpdate({'_id': req.params.jobID },{
        $set:{
            'require_trait_needs' : req.body.require_trait_needs,
            'require_trait_personality' : req.body.require_trait_personality,
            'require_trait_values' : req.body.require_trait_values,
            'title' : req.body.title,
            'description' : req.body.description,
            'start_date' : req.body.start_date,
            'end_date' : req.body.end_date,
            'specialization' : req.body.specialization,
            'require_skills' : req.body.require_skills
            } 
        },{new:true}).then((updatedData)=>{
        res.send({updatedData});
    });
});
app.patch('/updateProfile/:id/:type',(req,res)=>{
    //how to use > /updateProfile/_id/user_type

    var id = req.params.id;
    var type = req.params.type;
    var secondBody ;
    var database = eval(`${type}Schema`);
    var body = _.pick(req.body,['username','email']); // allow which property users can update
    if(type === "Employee"){
        secondBody = _.pick(req.body,['full_name','birthdate','specialization']);
        var thirdBody = _.pick(req.body,['description']);
        if(Object.keys(thirdBody).length === 0 && thirdBody.constructor === Object || thirdBody.description.content.length < 10 ){
            //Check for empty object or object shorter then 10 index of description posted
            console.log("The description is empty/short hence -NO API IS CALLED-" );
        }else{
            //excute > save new data
            database.findOneAndUpdate({_id: id},{
                $push: thirdBody
               },{new:true}).then((updatedData)=>{
                 if(!updatedData){
                    return res.status(404).send();
                 }
                 var profileParams = {
                    content:{ 
                        "contentItems": updatedData.description
                    },
                    'content_type': 'application/json',
                    'consumption_preferences': true,
                    'raw_scores': true
                };
                personalityInsights.profile(profileParams, function(error, profile) {
                     //excute > api calling
                    if (error) {
                      console.log(error);
                    }
                    else {
                      // make take the percentile and use it for some calcation of matching criteria
                      var needsArr =  [] ;
                      var personalityArr =  [] ;
                      var valuesArr =  [] ;
                      for(var x=0 ; x < 5; x++){
                       needsArr.push({
                           trait_name : _.orderBy(profile.needs, ['percentile'],['desc']).splice(0, 5)[x].name ,
                           trait_rank : x+1
                       });
                       personalityArr.push({
                        trait_name : _.orderBy(profile.personality, ['percentile'],['desc']).splice(0, 5)[x].name ,
                        trait_rank : x+1
                       });
                       valuesArr.push({
                        trait_name : _.orderBy(profile.values, ['percentile'],['desc']).splice(0, 5)[x].name ,
                        trait_rank : x+1
                       });
                      }
                      
                      database.findOneAndUpdate({_id :id },{$set:{trait_needs: needsArr , trait_personality: personalityArr, trait_values:valuesArr}},{new:true}).then((updatedData)=>{
                        console.log( "Api finished parsin");
                      });
                    }
                });
                 //console.log( "Added new description" ,updatedData);
               });
        }   
    }

    else if (type === "Company"){
        //company
        secondBody = _.pick(req.body,['company_name','bio','address','phone_no', 'company_type']);
    }
 
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
       
       database.findOneAndUpdate({_id: id},{
        $set: secondBody
       },{new:true}).then((updatedData)=>{
         if(!updatedData){
            return res.status(404).send();
         }
         //console.log(updatedData);
         res.send({updatedData});
       });
       
       UserSchema.findOneAndUpdate(id,{$set: body},{new:true}).then((updatedData)=>{
         //console.log(updatedData);
       });
});

app.delete('/delete/:id',(req,res)=>{
    var id = req.params.id;
    UserSchema.findByIdAndDelete(id).then((data)=>{
        console.log(data);
    });
    CompanySchema.findByIdAndDelete(id).then((data)=>{
        console.log(data);
    });
});
app.patch('/reset/:id',(req,res)=>{
    //To remove
    var obj = req.params.obj; //patch will GET/ first before change hence require a working get system via id 
    var body = _.pick(req.body,['username','password']); // allow which property users can update

    if(!ObjectID.isValid(obj)){
        return res.status(404).send();
    }
    if (_.isString(body.password) && body.password){
        body.password = obj;
        console.log('heyyy the body' , obj);
    }
    else{
        console.log('failed');
    }
    
});

io.on('connection',(socket)=>{
    console.log('user connected');
    
    // Log whenever a client disconnects from our websocket server
    socket.on('approval', (approve)=>{
        console.log('Server reads >' ,approve);
        io.emit('approved',approve);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});


server.listen(port,()=>{
    console.log('Server at port ',port);

});

/* Grave yard   
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'dist/project/index.html'));
});
express.static(path.join(__dirname,'dist/project'))

app.use('/auth/linkedin/callback', (req,res)=>{
    res.sendFile(path.join(__dirname,'dist/project/index.html'));
    console.log( JSON.stringify(res.body, undefined, 2));
    console.log( JSON.stringify(req.body, undefined, 2));
});

function updateEmployee(jobID,companyID,employeeID){
        EmployeeSchema.findOneAndUpdate({_id:employeeData._id },{$push :  {
            potentional_jobs: {
                job_id: jobList._id,
                company_id: jobList.company_id
            } 
        }}).then(data=>{
            console.log("how many time?");
        });
    };
    function updateCompany(){
        CompanySchema.findOneAndUpdate({_id:jobList.company_id},{$push :  {
            potential_employee:{
                employee_id: employeeData._id,
                job_id: jobList._id
            } 
        }}).then(data=>{
            console.log("company", data);
        });
    };
*/