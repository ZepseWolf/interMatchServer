const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://zepsewolf:Meow1234@ds046677.mlab.com:46677/intermatch',{ useNewUrlParser: true });
module.exports = {mongoose};