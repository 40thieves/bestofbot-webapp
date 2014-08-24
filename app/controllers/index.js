var mongoose = require('mongoose')

,	Video = mongoose.model('Video')
;

exports.render = function(req, res, next) {
	Video.paginate({}, req.query.page, req.query.limit, function(err, pageCount, videos, itemCount) {
		if (err) {
			console.log('err', err.message);
			next(err);
		}

		res.render('index', {
			videos: videos,
			pageCount: pageCount,
			itemCount: itemCount
		});
	});

};