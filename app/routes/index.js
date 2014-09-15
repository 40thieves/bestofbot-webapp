module.exports = function(app) {
	// Home route
	var index = require('../controllers/index');

	app.get('/', index.index);

	app.get('/about', index.about);
};