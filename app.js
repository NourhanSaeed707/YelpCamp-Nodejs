if(process.env.NODE_ENV !== "production"){
// it means that if we are in development enivornment(not deploy the website) require ('dotenv') environment and take
//varibales that in .env and them into process.env.NODE_ENV
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Joi = require("joi"); // for validation
const session = require("express-session");
const flash = require("connect-flash");
const {campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require("./models/user");
const passport = require("passport"); // for authentication and register and login form.
const LocalStrategy = require("passport-local");
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campground"); 
const reviewRoutes = require("./routes/reviews"); 
const mongoSanitize = require('express-mongo-sanitize');

// To connect to mongoosedb..
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected...");
});

//use ejs-mate so we can use layouts.
app.engine("ejs", ejsMate);
//define view engine so we can use ejs.
app.set('view engine', 'ejs');

//__dirname holds current directory address. Views is the folder where our all web pages will be kept.
app.set('views', path.join(__dirname, 'views'));

//to tell express to pass the body so we can access the body from form.
app.use(express.urlencoded( {extended: true} ));

//override method
app.use(methodOverride('_method'));

//to define path of public folder to express
app.use(express.static(path.join(__dirname, 'public')));

// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
// To remove data using these defaults:
app.use(mongoSanitize());

// configration of session
const sessionConfig = {
    secret:'thisshouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
// Date.now -> is in miliseconds, so here we expires after a week.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig));
app.use(flash());


//passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// how to store user in session.
passport.serializeUser(User.serializeUser());
// how to get user out of session.
passport.deserializeUser(User.deserializeUser());

//here we use that middleware so we can access any msg from flash in template so we mustn't pass flash
//msg to template we just use that midlleware so we can access flash from any template.
// and we have to put before routes.
app.use( (req, res ,next) => {
// By using that line every template can use currenyUser.
    res.locals.currentUser = req.user;
// we set flash msg to local variable.
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//fake user
// app.get('/fakeUser', async (req, res) => {
//     const user = new User({email: 'nour@gmail.com', username: 'nour'});
// // register method --> make new user with new given password ,Check if username is unique.
// // so here register method take instance of model User(user) and password and it will hash that password.
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

//routes of users
app.use("/",userRoutes);
// routes of campground
app.use("/campgrounds", campgroundRoutes);

// routes of review
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get('/', (req,res) => {
    res.render("Home");
});



//this is only respond if path didn't match any of other paths that above..
app.all('*', (req, res ,next) => {
    // here i'm sending message and statusCode to ExpressError so we can print what ever we want..
    next(new ExpressError('Page Not Found', 404));
});

//express middleware to handle errors..
app.use( (err, req, res, next) => {
    //here we extract statusCode and message from error and put defualt values for them..
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something Went Wrong !!';
    // here we send statusCode that we get from error and render error.ejs
    res.status(statusCode).render('error', { err } );
});


//define port that we want to host project on.
app.listen(3000, ()=> {
    console.log("Serving on port 3000...");
});