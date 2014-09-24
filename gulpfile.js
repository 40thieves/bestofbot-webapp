var gulp = require('gulp')
,	rename = require('gulp-rename')
,	sass = require('gulp-sass')
,	minifyCss = require('gulp-minify-css')
,	autoprefixer = require('gulp-autoprefixer')

,	bower = require('gulp-bower')

,	util = require('gulp-util')
,	nodemon = require('gulp-nodemon')

,	log = util.log
;

var paths = {
	sass: {
		src: {
			main: 'public/scss/style.scss',
			dir: 'public/scss/**/**.scss'
		},
		dest: 'public/css'
	},
	bower: {
		dest: {
			sass: 'public/sass/lib/'
		}
	}
};

/**
 * Bower
 */
gulp.task('bower', function() {
	log('Download Bower files' + (new Date()).toString());

	return bower()
		.pipe(gulp.dest(paths.bower.dest.sass));
});

/**
 * Sass
 */
gulp.task('sass', function() {
	log('Generate CSS' + (new Date()).toString());

	gulp.src(paths.sass.src.main)
		.pipe(sass({ style: 'expanded' }))
			.pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9'))
		.pipe(gulp.dest(paths.sass.dest))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifyCss())
		.pipe(gulp.dest(paths.sass.dest));
});

/**
 * Dev server
 */
 gulp.task('dev', function() {
 	log('Starting nodemon ' + (new Date()).toString());

 	nodemon({
 		script: 'app.js',
 		ext: 'js html'
 	})
 		.on('restart', function() {
 			log('Nodemon restarting ' + (new Date()).toString());
 		});

 	log('Watching scss' + (new Date()).toString());
 	gulp.watch(paths.sass.src.dir, ['sass']);
 });

 gulp.task('default', ['dev']);
