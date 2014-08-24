var mongoose = require('mongoose')
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

/**
 * Validations
 */
var validatePresenceOf = function(value) {
	return value && value.length;
};

// VideoSchema.path('title').validate(function(title) {
// 	return (validatePresenceOf(title) && typeof title === 'string');
// }, 'Title cannot be blank');

// VideoSchema.path('url').validate(function(url) {
// 	return (validatePresenceOf(url) && typeof url === 'string');
// }, 'URL cannot be blank');

/*
 * Statics
 */
// VideoSchema.statics = {
// 	*
// 	 * Find by id and populate user obj
// 	 * @param  {ObjectId}   id Link id
// 	 * @param  {Function}   cb Success/failure callback
	 
// 	load: function(id, cb) {
// 		this.findOne({
// 			_id: id
// 		}).populate('user', 'name username').exec(cb);
// 	}
// };

mongoose.model('Video', VideoSchema);