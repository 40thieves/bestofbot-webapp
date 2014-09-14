var YT = require('../services/YouTubeService.js').Service
,	TimestampCalc = require('../services/TimestampCalcService.js')

,	mongoose = require('mongoose')
,	Video = mongoose.model('Video')
;

module.exports = function(bot) {
	var listener = new Listener(bot);
};

var Listener = function(bot) {
	this.bot = bot;

	this.boot();
};

Listener.prototype.boot = function() {
	this.yt = new YT();
	this.timestamp = new TimestampCalc();

	this.bot.on('message', this.messageEvent.bind(this));
};

Listener.prototype.messageEvent = function(message, user, channel) {
	var self = this;

	this.yt.fetch(function(err, result) {
		if (err) {
			self.reply('Oh noes! ' + err.message, user);
			console.log('Err:', err.message);
			return;
		}

		try {
			var videoId = result.getVideoId()
			,	startTime = result.getActualStartTime()
			,	timestamp = self.timestamp.calcTimeDiff(startTime)
			,	video
			;

			console.log('Timestamp', timestamp);

			video = new Video({
				videoId: videoId,
				// timestamp: timestamp,
				description: message,
				user: user
			}).save(function(err, saved) {
				if (err) {
					self.reply('Oh noes! Save Failed');
					console.log(err.message);
				}

				console.log('Saved!');

				self.reply('Best of moment saved! Check it out at URL_HERE', user);
			});
		}
		catch(e) {
			console.log('Err:', e.message);
		}
	});
};

Listener.prototype.reply = function(message, user) {
	this.bot.msg(message, user);
};