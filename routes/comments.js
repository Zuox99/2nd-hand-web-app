var express = require("express");
var router  = express.Router({mergeParams: true});
var Market = require("../models/market");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find market by id
    // console.log(req.params.id);
    Market.findById(req.params.id, function(err, market){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {market: market});
        }
    })
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup market using ID
   Market.findById(req.params.id, function(err, market){
       if(err){
           console.log(err);
           res.redirect("/markets");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
			   req.flash("error", "Something went wrong");
               console.log(err);
           } else {
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   comment.save();
               market.comments.push(comment);
               market.save();
			   req.flash("success", "Successfully added comment!");
               res.redirect('/markets/' + market._id);
           }
        });
       }
   });
});

//COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {market_id: req.params.id, comment: foundComment});
		}
	});
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/markets/" + req.params.id);
		}
	});
});

//comment delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/markets/" + req.params.id);
		}
	});
});

module.exports = router;