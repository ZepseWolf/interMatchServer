const path = require('path');  
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIO = require('socket.io');
const {EmployeeSchema} = require('./employeeSchema.js');// testing
const {CompanySchema} = require('./companySchema.js');
const  _ = require('lodash');
var request = require('request'); 

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
const router =  express.Router();
const {mongoose} = require('./mongoose');


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
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'dist/project/index.html'));
});

app.all('/auth/linkedin/callback', (req,res)=>{
    console.log( res);
    console.log( req);
});
// mongoose END --------------------------------------------------------------------------
app.post('/register', (req,res)=>{
    if(req.body.usertype == "Employee"){
        console.log("Employee");
        var user = new EmployeeSchema({
            username : req.body.username,
            password : req.body.password 
        });
    }else{
        console.log("company");
        var user = new CompanySchema({
            username : req.body.username,
            password : req.body.password
        });
    } 
    
   
    user.save().then((doc)=>{
        res.send(doc);
        
    },(e)=>{
        res.status(400).send(e);
    }).catch((err)=>{
        res.send(err);
    });
    // UserSchema.find((err,userSchema)=>{
    //     if(err)
    //         console.log("Error : ", err);
    //     else{,=
    //         res.json(userSchema);
    //         //console.log(res);
    //     }         
    // })
});

app.get('/userSchema', (req,res)=>{
    
    Userschema.find().then((userSchema)=>{ 
        res.send({userSchema}); //website will display a success message
      },(err) =>{
          res.status(400).send(err);
      });
    // UserSchema.find((err,userSchema)=>{
    //     if(err)
    //         console.log("Error : ", err);
    //     else{
    //         res.json(userSchema);
    //         //console.log(res);
    //     }         
    // })
});
app.patch('userSchema/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body);

    
    
});
router.route('/signup').post( (req,res)=>{
    let userSchema = new UserSchema(req.body);
    userSchema.save()
    .then(userSchema=>{
        res.status(200).json({'userSchema': 'Added successfully'})
    })
    .catch(err =>{
        res.status(400).send('Failed to add')
    })
});
router.route('/user/submit/:id').post((req,res)=>{
    Issue.findById(req.params.id, (err, submit)=>{
        if (!submit)
         return next(new Error('could not load error'));
        else {
            submit.interactivity.status =  req.interactivity.status;
        }
    })
})

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


*/