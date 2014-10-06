var youtubeApi = require('youtube-get')

,	config = require('../config/config')
;

var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function() {
		orig[key] = extra[key];
	});
};

var YouTubeResult = function(result) {
	this.result = result;
};

YouTubeResult.prototype.getActualStartTime = function() {
	if ( ! this.result.liveStreamingDetails) {
		throw new Error('Video not live streamed');
	}

	var liveStream = this.result.liveStreamingDetails;

	if ( ! liveStream.actualStartTime) {
		throw new Error('No actual start time');
	}

	return liveStream.actualStartTime;
};

YouTubeResult.prototype.getVideoId = function() {
	return this.result.id;
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
		part: 'snippet',
		channelId: 'UC-vIANCum1yBw_4DeJImc0Q',
		maxResults: 1,
		order: 'date',
		type: 'video'
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

YouTubeService.prototype.fetch = function(callback) {
	var self = this;

	this.search(function(err, data) {
		if (err)
			return callback(err);

		if ( ! data || ! data.items || ! data.items.length)
			return callback(new Error('No search results'));

		var videoData = data.items[0];

		if ( ! videoData.snippet || ! videoData.snippet.liveBroadcastContent)
			return callback(new Error('Unknown error'));

		if (videoData.snippet.liveBroadcastContent != 'live')
			return callback(new Error('Not live yet!'));

		if ( ! videoData.id || ! videoData.id.videoId)
			return callback(new Error('Unknown error'));

		self.videoDetails(videoData.id.videoId, function(err, data) {
			if (err)
				return callback(new Error('No video found'));

			var result = new YouTubeResult(data.items[0]);

			return callback(null, result);
		});
	});
};

module.exports = {
	Service: YouTubeService,
	Result: YouTubeResult
};
