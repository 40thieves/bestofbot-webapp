var YT = require('../services/YouTubeService.js');

// YT check service
// Timestamp calc service

module.exports = function(bot) {
	var yt = new YT();

	bot.on('message', function() {
		// console.log('succ!');

		yt.fetchStartTime(function(err, time) {
			if (err) {
				console.log('Err:', err.message);
				return false;
			}

			console.log(time);
		});
	});
};