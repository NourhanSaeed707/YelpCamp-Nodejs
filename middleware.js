const {campgroundSchema,reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require('./models/campground');
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
// here we check before create new campground if user is login or not(isAuthanticated or not),
// so if not login we have to display message to tell him to login and redirect to login form.
// otherwise we just make a new campground(here user is login).

//to store url so we can redirect to previous url.
// console.log(req.path, req.originUrl);
    req.session.returnTo = req.originalUrl; // here we store previous url that we want to get back to.
    if(!req.isAuthenticated()){
        req.flash('error', 'You must sign in first!');
        return res.redirect('/login');
    }
    // so if u are authenticated go to next().
    next();
}

//function to check validation..
module.exports.validateCampground = (req, res, next) => {
    //Joi: javascript tool used to make sure that info is valide,
    // and it's on server side to make sure that no one can add or edit data on server side through postman
    //so we cannot enter invalide data into our website through postman or any api check.
        
        // we send body of campground to campgroundShema so we can know if it is valide or not ..
        //we extract campgroundSchema from schema.js file.
        const { error } = campgroundSchema.validate(req.body);
        if(error){
            //here we iterate over error details cause it's array of of object of errors.
            const msg = error.details.map(el => el.message).join(',');
    // that send error details(message of error) and statusCode to ExpressError that will pass error to 
    //express middleware handling error.
            throw new ExpressError(msg, 400);
        }else{
            // to go to next routes ..
            next();
        }
}
module.exports.isAuth = async(req, res, next) => {
// here we check if the logged in user have permission to edit or delete campground,
// depend on if he's the author of campground or not and this check is in the server side ,so 
//we can make sure that no one can edit or delete by sending request from postman or using the url of edit 
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
     // server side check
     if(!campground.author.equals(req.user._id)){
       req.flash('error', 'You do not have permission to do that!');
       return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

// function to check if that review belong to logged in user(author) or not, cause if that review dosn't
// belog to currentUser(author) then we cann't edit or delete this review and this check in server side.
module.exports.isReviewAuth = async(req, res, next) => {
    // here we check if the logged in user have permission to edit or delete campground,
    // depend on if he's the author of campground or not and this check is in the server side ,so 
    //we can make sure that no one can edit or delete by sending request from postman or using the url of edit 
        const {id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
         // server side check
         if(!review.author.equals(req.user._id)){
           req.flash('error', 'You do not have permission to do that!');
           return res.redirect(`/campgrounds/${id}`);
       }
       next();
    }

//functin validation for review.
module.exports.validateReview = (req, res, next) => {
    // we send body of review to reviewSchema so we can know if it's valide or not ..
    // we extract error from reviewSchema from schema.js file. 
          const {error} = reviewSchema.validate(req.body);
          if(error){
         // we iterate over errors details cause it's array of object of errors.
            const msg = error.details.map(el => el.message).join(',');
    // here we send details(message and statusCode) to ExpressError thta it will pass error to express middleware
    //handling error.
            throw new ExpressError(msg, 400);
          }else{
            // if there is no error so we go to next routes ..
              next();
          }
}