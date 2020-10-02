var mongoose = require("mongoose");

var marketSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	address: String,
	phone: String,
	description: String,
	createAt: {type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Market", marketSchema);