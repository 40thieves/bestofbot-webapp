var mongoose = require('mongoose')
,	bestofbot = require('bestofbot')
;

var config = require('./app/config/config');
var db = mongoose.connect(config.db);
// Bootstrap IRC
var bot = new bestofbot();
bot.join();

var app = require('./app/config/system/bootstrap')(db, bot);

app.listen(config.port);
console.log('Express started on port ' + config.port);

exports = module.exports = app;