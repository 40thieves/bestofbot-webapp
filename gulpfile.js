var gulp = require('gulp')
,	util = require('gulp-util')
,	nodemon = require('gulp-nodemon')
,	log = util.log
;

/**
 * Production server
 */
gulp.task('prod', function() {
	log('Starting nodemon ' + (new Date()).toString());

	nodemon({
		script: 'app.js',
		ext: 'js html'
	})
		.on('restart', function() {
			log('Nodemon restarting ' + (new Date()).toString());
		});
});