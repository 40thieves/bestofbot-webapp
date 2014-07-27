var mongoose = require('mongoose')
,	Schema = mongoose.Schema
;

/*
 * Link Schema
 */
var LinkSchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	url: {
		type: String,
		unique: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	tags: [{
		type: Schema.ObjectId,
		ref: 'Tag'
	}],
	private: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
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

LinkSchema.path('title').validate(function(title) {
	return (validatePresenceOf(title) && typeof title === 'string');
}, 'Title cannot be blank');

LinkSchema.path('url').validate(function(url) {
	return (validatePresenceOf(url) && typeof url === 'string');
}, 'URL cannot be blank');

/*
 * Statics
 */
LinkSchema.statics = {
	/**
	 * Find by id and populate user obj
	 * @param  {ObjectId}   id Link id
	 * @param  {Function}   cb Success/failure callback
	 */
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).populate('user', 'name username').exec(cb);
	}
};

mongoose.model('Link', LinkSchema);