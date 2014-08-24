var YT = require('../services/YouTubeService.js').Service
,	TimestampCalc = require('../services/TimestampCalcService.js')
;

module.exports = function(bot) {
	var yt = new YT();
	var timestampCalc = new TimestampCalc();

	bot.on('message', function() {
		// console.log('succ!');

		yt.fetch(function(err, result) {
			if (err) {
				console.log('Err:', err.message);
				return false;
			}

			var startTime;

			try {
				startTime = result.getActualStartTime();
			}
			catch(e) {
				console.log('Err:', e.message);
			}

			var timestamp = timestampCalc.calcTimeDiff(startTime);
			console.log(timestamp);
		});
	});
};