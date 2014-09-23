var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 8001,
	db: process.env.MONGOHQ_URL,
	templateEngine: 'swig',

	sessionSecret: '7ZlOZhWnwJRD',
	sessionCollection: 'sessions',

	bestofbot: {
		
	},

	youtube: {
		api_key: process.env.YOUTUBE_API_KEY || 'YOUR-API-KEY-HERE'
	}
};