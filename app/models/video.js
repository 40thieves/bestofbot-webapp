var mongoose = require('mongoose')
,	pagination = require('mongoose-paginate')
,	Schema = mongoose.Schema
;

/*
 * Link Schema
 */
var VideoSchema = new Schema({
	videoId: {
		type: String,
		required: true
	},
	// timestamp: {
	// 	type: String,
	// 	required: true
	// },
	description: {
		type: String,
		trim: true
	},
	user: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

VideoSchema.plugin(pagination);

mongoose.model('Video', VideoSchema);