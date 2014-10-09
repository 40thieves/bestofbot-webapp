var youtubeApi = require('youtube-get')
,	moment = require('moment')

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
	if ( ! this.result.id)
		throw new Error('No video id');

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

		var result = self.parseSearchResults(data);

		if (result instanceof Error)
			return callback(result);

		self.videoDetails(result, function(err, data) {
			if (err)
				return callback(new Error('No video found'));

			var video = self.parseVideoResult(data);
			if (video instanceof Error)
				return callback(video);

			var result = new YouTubeResult(video);

			return callback(null, result);
		});
	});
};

YouTubeService.prototype.parseSearchResults = function(searchResults) {
	if ( ! searchResults || ! searchResults.items || ! searchResults.items.length)
		return new Error('No search results');

	var searchResult = searchResults.items[0];

	if ( ! searchResult.id || ! searchResult.id.videoId)
		return new Error('Unknown error');

	return searchResult.id.videoId;
};

YouTubeService.prototype.parseVideoResult = function(videoResult) {
	if ( ! videoResult || ! videoResult.items || ! videoResult.items.length)
		return new Error('No video found');

	var video = videoResult.items[0];

	if (video.liveStreamingDetails) {
		if (video.liveStreamingDetails.actualEndTime)
				return new Error('Video is not live!');
	}
	else {
		return new Error('Video is not live!');
	}

	return video;
};

module.exports = {
	Service: YouTubeService,
	Result: YouTubeResult
};
