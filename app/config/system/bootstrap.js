var fs = require('fs')
,	express = require('express')
,	BestOfBot = require('bestofbot')
,	appPath = process.cwd()
;

module.exports = function(db) {
	function bootstrapModels() {
		var models_path = appPath + '/app/models';
		var walk = function(path) {
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
		};
		walk(models_path);
	}

	bootstrapModels();

	// Bootstrap IRC
	var bsb = new BestOfBot().join();

	// Init express settings
	var app = express();
	require(appPath + '/app/config/express')(app, db);

	return app;
};