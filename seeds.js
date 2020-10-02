var	mongoose = require("mongoose"),
	Market = require("./models/market"),
	Comment = require("./models/comment");

var data = [
	{
		name: "Salmon Creek", 
		 image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
		description: "111"
	},
    {
		name: "Granite Hill", 
		 image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
		description: "222"
	},
    {
		name: "Mountain Goat's Rest", 
		image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
		description: "333"
	}
]

function seedDB(){
	Market.deleteMany({}, function(err) {
		// if(err) {
		// 	console.log(err);
		// }
		// console.log("removed!");
		// data.forEach(function(seed) {
		// 	Market.create(seed, function(err, market) {
		// 		if(err) {console.log(err);}
		// 		else {
		// 			console.log("added");
		// 			Comment.create(
		// 			{
		// 				text: "great!",
		// 				author: "Bob"
		// 			}, function(err, comment) {
		// 				if(err) {console.log(err);}
		// 				else {
		// 					market.comments.push(comment);
		// 					market.save();
		// 					console.log("new comment");
		// 				}
						
		// 			})
		// 		}
		// 	});
		// })
	});
};

module.exports = seedDB;