var youtubeApi = require('youtube-get')

,	config = require('../config/config')
;

var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function() {
		orig[key] = extra[key];
	});
};

var YouTubeService = function(options) {
	if (options) {
		if (options.search)
			extend(this.options.search, options.search);
		if (options.videoDetails)
			extend(this.options.videoDetails, options.videoDetails);
	}
};

YouTubeService.prototype.options = {
	search: {
		part: 'id,snippet',
		channelId: 'UC-vIANCum1yBw_4DeJImc0Q',
		eventType: 'live',
		type: 'video',
		maxResults: 1,
		order: 'date'
	},
	videoDetails: {
		part: 'liveStreamingDetails',
	}
};

YouTubeService.prototype.youtube = youtubeApi(config.youtube.api_key);

YouTubeService.prototype.search = function(callback) {
	this.youtube('search', this.options.search, callback);
};

YouTubeService.prototype.videoDetails = function(id, callback) {
	var options = this.options.videoDetails;
	options.id = id;

	this.youtube('videos', options, callback);
};

YouTubeService.prototype.fetchStartTime = function(callback) {
	var self = this;

	this.search(function(err, data) {
		if (err)
			return callback(err);

		if ( ! data.items.length)
			return callback(new Error('No search results'));

		self.videoDetails(data.items[0].id.videoId, function(err, data) {
			if (err)
				return callback(err);

			return callback(null, self.parseActualStartTime(data));
		});
	});
};

YouTubeService.prototype.parseActualStartTime = function(data) {
	var details = data.items[0].liveStreamingDetails;

	if ( ! details.actualStartTime)
		return null;

	return details.actualStartTime;
};

module.exports = YouTubeService;
