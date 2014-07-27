var mongoose = require('mongoose');

var config = require('./app/config/config');
var db = mongoose.connect(config.db);

var app = require('./app/config/system/bootstrap')(db);

app.listen(config.port);
console.log('Express started on port ' + config.port);

exports = module.exports = app;