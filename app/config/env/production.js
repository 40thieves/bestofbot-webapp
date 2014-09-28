module.exports = {
	db: 'mongodb://localhost/bestofbot',
	app: {
		name: 'Best Of Bot'
	},
	bestofbot: {
		host: 'irc.cordkillers.com',
		channels: [
			'#chat'
		],
		joinMessage: false
	}
};