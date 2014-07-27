var _ = require('lodash')
,	fs = require('fs')
;

// Load env config
process.env.NODE_ENV = ~fs.readdirSync('./app/config/env').map(function(file) {
	return file.slice(0, -3);
}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

// Extend base config with env config
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV || {})
);