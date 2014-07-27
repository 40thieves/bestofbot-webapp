var _ = require('lodash')
,	async = require('async')
,	mongoose = require('mongoose')

,	Link = mongoose.model('Link')
,	Tag = mongoose.model('Tag')
;

/**
 * Helper function: find link by id
 * Resolves link param in url to link obj in db
 */
exports.link = function(req, res, next, id) {
	Link.load(id, function(err, link) {
		if (err)
			return next(err);

		if ( ! link)
			return next(new Error('Failed to load link ' + id));

		req.link = link;

		next();
	});
};

/**
 * List all links
 */
exports.all = function(req, res) {
	Link.find()
		.sort('-created')
		.populate('user', 'name username')
		.populate('tags', 'name')
		.exec(function(err, links) {
			if (err)
				return res.send(500, {
					message: 'Failed to fetch links',
					err: err
				});

			res.jsonp(links);
		});
};

/**
 * Show a link
 */
exports.show = function(req, res) {
	Link.populate(req.link, [
		{ path: 'user', select: 'name username' },
		{ path: 'tags', select: 'name' }
	], function(err, link) {
		if (err)
			return res.send(500, {
				message: 'Failed to populate link data',
				err: err
			});

		res.jsonp(link);
	});
};

/**
 * Create a link
 */
exports.create = function(req, res) {
	if (_.isArray(req.body))
		return res.send(400, 'Cannot create multiple links');

	// Perform one after the other
	async.waterfall([
		function(callback) {
			if (req.body.tags) {
				/*
				 * Save tags
				 */
				Tag.saveMultipleByName(req.body.tags, req.user, function(err, tags) {
					if (err)
						return callback(err);

					callback(null, tags);
				});
			}
			else {
				// No tags, skip to link saving
				callback(null, []);
			}
		},
		function(tags, callback) {
			/*
			 * Save link
			 */
			// Prevent string-based tags (rather than desired ObjectId-based tags)
			// from inclusion in link obj
			if (req.body.tags && req.body.tags.length > 0)
				req.body = _.omit(req.body, 'tags');

			// Create new link obj
			var link = new Link(req.body);

			// Add ObjectId-based tags to link obj
			if (tags && tags.length > 0)
				link.tags = tags;

			// Add user id to link obj
			link.user = req.user;

			link.save(function(err, link) {
				if (err)
					return callback(err);

				callback(null, link);
			});
		},
		function(link, callback) {
			/*
			 * Populate user
			 */
			link.populate('user', 'name username', function(err, populated) {
				if (err)
					return callback(err);

				callback(null, populated);
			});
		},
		function(link, callback) {
			/*
			 * Populate tags
			 */
			link.populate('tags', 'name', function(err, populated) {
				if (err)
					return callback(err);

				callback(null, populated);
			});
		}
	], function(err, result) {
		if (err) {
			if (err.name == 'ValidationError')
				return res.send(400, 'Validation failed');

			return res.send(500, {
				message: 'Failed to create link',
				err: err
			});
		}
		else {
			res.jsonp(result);
		}
	});
};

/**
 * Update a link
 */
exports.update = function(req, res) {
	async.waterfall([
		function(callback) {
			/*
			 * Save (new) tags
			 */
			if (req.body.tags) {
				Tag.saveMultipleByName(req.body.tags, req.user, function(err, tags) {
					if (err)
						return callback(err);

					callback(null, tags);
				});
			}
			else {
				callback(null, []);
			}
		},
		function(tags, callback) {
			/*
			 * Update link
			 */
			var link = req.link; // req.link populated by helper link() fn

			// Prevent string-based tags (rather than desired ObjectId-based tags)
			// from inclusion in link obj
			if (req.body.tags && req.body.tags.length > 0)
				req.body = _.omit(req.body, 'tags');

			// Merge existing link properties with updated properties
			link = _.extend(link, req.body);

			// Merge updated ObjectId-based tags with obj
			if (tags && tags.length > 0)
				link.tags = tags;

			link.save(function(err, link) {
				if (err)
					return callback(err);

				callback(null, link);
			});
		},
		function(link, callback) {
			/*
			 * Populate user
			 */
			link.populate('user', 'name username', function(err, populated) {
				if (err)
					return callback(err);

				callback(null, populated);
			});
		},
		function(link, callback) {
			/*
			 * Populate tags
			 */
			link.populate('tags', 'name', function(err, populated) {
				if (err)
					return callback(err);

				callback(null, populated);
			});
		}
	], function(err, result) {
		if (err) {
			if (err.name == 'ValidationError')
				return res.send(400, 'Validation failed');

			return res.send(500, {
				message: 'Failed to update link',
				err: err
			});
		}
		else {
			res.jsonp(result);
		}
	});
};

/**
 * Delete a link
 */
exports.destroy = function(req, res) {
	var link = req.link; // req.link populated by helper link() fn

	link.remove(function(err, removed) {
		if (err)
			return res.send(500, {
				message: 'Failed to remove link',
				err: err
			});

		res.jsonp(removed);
	});
};