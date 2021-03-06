var mongoose = require('mongoose')

,	Video = mongoose.model('Video')
;

exports.index = function(req, res, next) {
	var currentPage = req.query.page || 1;
	var limit = req.query.limit || 5;

	Video.paginate({}, currentPage, limit, function(err, pageCount, videos, itemCount) {
		if (err) {
			console.log('err', err.message);
			next(err);
		}

		var pages = [];
		for (i = 0; i < pageCount; i++) {
			var pageNum = i + 1;
			pages.push({
				number: pageNum,
				url: '?page=' + pageNum
			});
		}

		res.render('index', {
			videos: videos,
			pages: pages,
			currentPage: currentPage,
			pageCount: pageCount,
			itemCount: itemCount,
			nextPage: pages[currentPage] || null,
			prevPage: pages[currentPage - 2] || null
		});
	}, { sortBy: { createdAt: -1 } }); // Sort reverse chronological order
};

exports.about = function(req, res, next) {
	res.render('about')
};
