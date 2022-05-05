const Campground = require('../models/campground');
const Review = require("../models/review");

//createReview function --> to create a new review for specific campground.
module.exports.createReview = async (req, res ) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // to save currentUser's id to review.author.
 // we call review (that is array) that inside campground and push the new review into it.
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created New Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

//deleteReview function --> to delete review of specific campground.
module.exports.deleteReview =  async(req, res) =>{
    // we extract campground id (id) and review id(reviewId) from req.params so we can use it directly.
        const { id, reviewId } = req.params;
    
    // we update campground so we can delete review that we want to delete from campground cause we don't 
    // want to delete the whole campground we need to delete just one review not all reviews not all campground
    // so we use $pull (it removes from an existing array all instances value or values that matche specified condition).
    // so we use it ($pull) so we just remove one review that match reviewId.
    // so $pull it will take reviewId and pull out (remove) all values in reviews(in campground) that matche this reviewId.
       await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId} });
    // here we find id of review we want to delete by req.params.reviewId that have review'id.
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted review.');
        res.redirect(`/campgrounds/${id}`);
    }