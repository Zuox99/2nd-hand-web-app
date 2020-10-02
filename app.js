require('dotenv').config();
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	moment = require("moment");
	Market = require("./models/market"),
	flash = require("connect-flash"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
	marketRoutes = require("./routes/markets"),
	indexRoutes = require("./routes/index")

mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected');
}).catch(err => {
	console.log('ERROR: ', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.moment = require("moment");
	next();
})

app.use("/", indexRoutes);
app.use("/markets", marketRoutes);
app.use("/markets/:id/comments", commentRoutes);

app.listen(process.env.PORT || 2000, process.env.IP || '0.0.0.0', function() {
	console.log("The Market Server Has Started!");
	
});