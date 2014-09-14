var moment = require('moment');

var extend = function(orig, extra) {
	return Object.keys(extra).forEach(function() {
		orig[key] = extra[key];
	});
};

var TimestampService = function(options) {
	if (options)
		extend(this.options, options);
};

TimestampService.prototype.options = {
	bestOfStart: {
		time: '5',
		order: 'minutes'
	}
};

TimestampService.prototype.getFiveMinsAgo = function() {
	return new moment().subtract(this.options.bestOfStart.time, this.options.bestOfStart.order);
};

TimestampService.prototype.calcTimeDiff = function(videoStartStr) {
	var bestOfStart = this.getFiveMinsAgo();
	var videoStart = new moment(videoStartStr, moment.ISO_8601);

	var diff = bestOfStart.diff(videoStart, 'seconds');

	// Prevent 'negative' timestamps, and just return beginning of video
	if (diff < 0) return '0';

	var minsAgo = Math.floor(diff / 60);
	var secsAgo = diff % 60;

	return minsAgo + 'm' + secsAgo + 's';
};

module.exports = TimestampService;