var fs = require('fs')
,	express = require('express')
,	BestOfBot = require('bestofbot')
,	appPath = process.cwd()
;

function walk(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);

		if (stat.isFile()) {
			if (/(.*)\.(js$)/.test(file)) {
				require(newPath);
			}
			else if (stat.isDirectory()) {
				walk(newPath);
			}
		}
	});
}

module.exports = function(db, bot) {
	function bootstrapModels() {
		var modelsPath = appPath + '/app/models';
		walk(modelsPath);
	}

	// function bootstrapEvents() {
	// 	var eventsPath = appPath + '/app/events';
	// 	walk(eventsPath);
	// }

	bootstrapModels();

	require(appPath + '/app/events/irc')(bot);

	// Init express settings
	var app = express();
	require(appPath + '/app/config/express')(app, db);

	return app;
};