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

TimestampService.prototype.options = {};

TimestampService.prototype.getFiveMinsAgo = function() {
	return new moment().subtract('5', 'minutes');
};

TimestampService.prototype.getOneMinAgo = function() {
	return new moment().subtract('1', 'minutes');
};

TimestampService.prototype.isAtVideoStart = function(videoStart) {
	var bestOfStart = this.getFiveMinsAgo();
	var diff = bestOfStart.diff(videoStart, 'seconds');

	return diff < 5;
};

TimestampService.prototype.getShortDiff = function(videoStart) {
	var bestOfStart = this.getOneMinAgo();

	var diff = bestOfStart.diff(videoStart, 'seconds');

	if (diff < 0) return '0'; // Prevent 'negative' timestamps, and just return beginning of video
	return diff;
};

TimestampService.prototype.getLongDiff = function(videoStart) {
	var bestOfStart = this.getFiveMinsAgo();

	var diff = bestOfStart.diff(videoStart, 'seconds');

	if (diff < 0) return '0'; // Prevent 'negative' timestamps, and just return beginning of video
	return diff;
};

TimestampService.prototype.calcTimeDiff = function(videoStartStr) {
	var videoStart = new moment(videoStartStr, moment.ISO_8601)
	,	diff
	;

	// If at video start, start video further back
	// This handles YT API issue where it takes a long time to 
	if (this.isAtVideoStart(videoStart))
		diff = this.getLongDiff(videoStart);
	else
		diff = this.getShortDiff(videoStart);

	var minsAgo = Math.floor(diff / 60);
	var secsAgo = diff % 60;

	return minsAgo + 'm' + secsAgo + 's';
};

module.exports = TimestampService;