var express = require("express");
var router  = express.Router();
var Market = require("../models/market");
var middleware = require("../middleware");
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dtv4bqsru', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//INDEX - show all campgrounds
router.get("/", function(req, res){
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		// Get all campgrounds from DB
		Market.find({name: regex}, function(err, allMarkets){
		   if(err){
			   console.log(err);
		   } else {
			   if(allMarkets.length < 1) {
				   req.flash("error", "Nothing found");
				   res.redirect("/markets"); 
			   } else {
				   res.render("markets/index",{markets:allMarkets});
			   }
		   }
		});
	} else {
		// Get all campgrounds from DB
		Market.find({}, function(err, allMarkets){
		   if(err){
			   console.log(err);
		   } else {
			  res.render("markets/index",{markets:allMarkets});
		   }
		});
	}
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
	cloudinary.uploader.upload(req.file.path, function(result) {
	  // add cloudinary url for the image to the campground object under image property
	  req.body.market.image = result.secure_url;
	  // add author to campground
	  req.body.market.author = {
		id: req.user._id,
		username: req.user.username
	  }
	  Market.create(req.body.market, function(err, market) {
		if (err) {
		  req.flash('error', err.message);
		  return res.redirect('back');
		}
		res.redirect('/markets/' + market.id);
	  });
	});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("markets/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Market.findById(req.params.id).populate("comments").exec(function(err, foundMarket){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground)
            //render show template with that campground
            res.render("markets/show", {market: foundMarket});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkMarketOwnership, function(req, res) {
	Market.findById(req.params.id, function(err, foundMarket) {
		res.render("markets/edit", {market: foundMarket});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkMarketOwnership, function(req, res) {
	Market.findByIdAndUpdate(req.params.id, req.body.market, function(err, updatedMarket) {
		if(err) {
			res.redirect("/markets");
		} else {
			res.redirect("/markets/" + req.params.id);
		};
		
	})
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkMarketOwnership, function(req, res) {
	Market.findByIdAndDelete(req.params.id, function(err) {
		if(err) {
			res.redirect("/markets");
		} else {
			res.redirect("/markets");
		}
	});
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;