var YT = require('../services/YouTubeService.js').Service
,	TimestampCalc = require('../services/TimestampCalcService.js')

,	mongoose = require('mongoose')
,	Video = mongoose.model('Video')
;

module.exports = function(bot) {
	var yt = new YT();
	var timestampCalc = new TimestampCalc();

	bot.on('message', function(message, user, channel) {
		// console.log('succ!');

		yt.fetch(function(err, result) {
			if (err) {
				console.log('Err:', err.message);
				return false;
			}

			var videoId = result.getVideoId();

			var startTime;
			try {
				startTime = result.getActualStartTime();
			}
			catch(e) {
				console.log('Err:', e.message);
			}

			var timestamp = timestampCalc.calcTimeDiff(startTime);

			var video = new Video({
				videoId: videoId,
				// timestamp: timestamp,
				description: message,
				user: user
			});

			video.save(function(err, saved) {
				if (err) {
					console.log(err.message);
				}

				console.log('Saved!');

				bot.send('Best of moment saved!', channel);
			});
		});
	});
};
