var YT = require('../services/YouTubeService.js')
,	TimestampCalc = require('../services/TimestampCalcService.js')
;

// YT check service
// Timestamp calc service

module.exports = function(bot) {
	var yt = new YT();
	var timestampCalc = new TimestampCalc();

	bot.on('message', function() {
		// console.log('succ!');

		yt.fetchStartTime(function(err, startTime) {
			if (err) {
				console.log('Err:', err.message);
				return false;
			}

			var timestamp = timestampCalc.calcTimeDiff(startTime);
			console.log(timestamp);
		});
	});
};