var express = require('express')
,	fs = require('fs')
,	consolidate = require('consolidate')
,	compress = require('compression')
,	logger = require('morgan')
,	session = require('express-session')
,	mongoStore = require('connect-mongo')(session)
,	cookieParser = require('cookie-parser')
,	bodyParser = require('body-parser')
,	methodOverride = require('method-override')
,	favicon = require('serve-favicon')
,	flash = require('connect-flash')
,	helpers = require('view-helpers')
,	expressValidator = require('express-validator')

,	config = require('./config')
,	appPath = process.cwd()
;

module.exports = function(app, db) {
	app.set('showStackError', true);

	// Prettify html
	app.locals.pretty = true;

	// cache=memory or swig dies in NODE_ENV=production
	app.locals.cache = 'memory';

	// Compress assets
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		}
	}));

	// Only use logger for dev env
	if (process.env.NODE_ENV === 'development') {
		app.use(logger('dev'));
	}

	// Assign the template engine to html files
	app.engine('html', consolidate[config.templateEngine]);

	// Set html as default extension
	app.set('view engine', 'html');

	// Set views path, template engine and default layout
	app.set('views', config.root + '/app/views');

	// Enable jsonp
	app.enable('jsonp callback');

	app.use(cookieParser());
	app.use(bodyParser());

	app.use(expressValidator());
	app.use(methodOverride());

	// Express/mongo session storage
	app.use(session({
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	}));

	// Use view helpers
	app.use(helpers(config.app.name));

	// Use connect-flash for flash messages
	app.use(flash());

	// TODO: Add favicon
	// // Favicon
	// app.use(favicon('PATH TO FAVICON'));

	// Static dir
	app.use('/public', express.static(config.root + '/public'));

	bootstrapRoutes();

	// 500 errors
	app.use(function(err, req, res, next) {
		// If err message contains 'not found', treat as 404
		// TODO: switch to error objects?
		if (~err.message.indexOf('not found'))
			return next();

		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});

	function bootstrapRoutes() {
		var routes_path = appPath + '/app/routes';
		var walk = function(path) {
			fs.readdirSync(path).forEach(function(file) {
				var newPath = path + '/' + file;
				var stat = fs.statSync(newPath);

				if (stat.isFile()) {
					if (/(.*)\.(js$)/.test(file)) {
						require(newPath)(app);
					}
					// Skip middlewares dir - used by routes, not a route itself
					else if (stat.isDirectory() && file !== 'middlewares') {
						walk(newPath);
					}
				}
			});
		};

		walk(routes_path);
	}
};