const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin1234:meow1234@ds046677.mlab.com:46677/intermatch',{ useNewUrlParser: true });
module.exports = {mongoose};

//mongodb://localhost:27017/intermatch
//mongodb://admin1234:meow1234@ds046677.mlab.com:46677/intermatch