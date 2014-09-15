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

	this.bot.on('message', this.message.bind(this));
	this.bot.on('raw-message', this.aboutMessage.bind(this));
};

Listener.prototype.message = function(message, user, channel) {
	var self = this;

	this.yt.fetch(function(err, result) {
		if (err) {
			self.reply('Oh no! ' + err.message, user);
			console.log('Err:', err.message);
			return;
		}

		try {
			var videoId = result.getVideoId()
			,	startTime = result.getActualStartTime()
			,	timestamp = self.timestamp.calcTimeDiff(startTime)
			,	video
			;

			video = new Video({
				videoId: videoId,
				timestamp: timestamp,
				description: message,
				user: user
			}).save(function(err, saved) {
				if (err) {
					self.reply('Oh no! Save Failed');
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

Listener.prototype.aboutMessage = function(message, user, channel) {
	// If mesage is addressed to the bot (either in a DM or a reply), send about message
	if (/^bestofbot:? [aA]bout/.test(message) || channel == 'bestofbot') {
		this.reply('Hi there! I\'m a bot that tracks best of moments on DTNS, check them out at URL_HERE', user);
	}
};

Listener.prototype.reply = function(message, user) {
	this.bot.msg(message, user);
};