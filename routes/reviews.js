const express = require("express");
//here we use mergeParams:true cause express router keeps their params separate 
//it means that review won't see campground's params and that cause error in our code,
// so to avoid that we use mergeParams:true.
const router = express.Router({ mergeParams:  true} );
const reviews = require("../controllers/reviews");
const {reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview,isLoggedIn,isReviewAuth } = require("../middleware");

// post review of specific campground
router.post('/', validateReview ,isLoggedIn , catchAsync(reviews.createReview ));
 
 //deleting review
 router.delete('/:reviewId', isLoggedIn, isReviewAuth ,catchAsync(reviews.deleteReview));

module.exports = router;