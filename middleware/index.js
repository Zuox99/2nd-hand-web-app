var Market = require("../models/market");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkMarketOwnership = function(req, res, next){
	if(req.isAuthenticated()) {
		Market.findById(req.params.id, function(err, foundMarket) {
			if(err) {
				req.flash("error", "Cannot found");
				res.redirect("back");
			} else {
				if(foundMarket.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}			
			}
		});
	} else {
		req.flash("error", "Please Login First!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err) {
				req.flash("error", "Cannot found");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}			
			}
		});
	} else {
		req.flash("error", "Please Login First!");
		res.redirect("back");
	}
}

//middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please Login First!")
    res.redirect("/login");
}

module.exports = middlewareObj