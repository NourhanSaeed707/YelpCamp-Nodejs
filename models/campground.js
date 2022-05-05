const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});
//virtual function --> we don't need to store that update url in database(mongo)
ImageSchema.virtual('thumbnail').get( function(){
    //here to reduce the size of image (width:200) so we can reduce time to upload image.
    // replace --> it's gonna replace the first match .
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title:{
        type:String
    },
    images: [ImageSchema],
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required: true
        } 
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    location:{
        type:String
    },
    author:{
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: [
        {
//this type is in mongodb not in javascript, and we use it to define that we will have 
//multiple ids from another collection(like review's id). 
            type: Schema.Types.ObjectId,
// ref for to define which review that belong to so that belong to Review Model (review collection).
//and it's so important in population.
            ref: 'Review'
        }
    ]
}, opts);


//virtual function --> we don't need to store that update url in database(mongo)
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

//to delete campground and delete campground's reviews(reviews that in that campground).
CampgroundSchema.post('findOneAndDelete', async function(doc ) {
      if(doc){
// doc = campground that has been deleted ( that has reviews in it ).
// here we delete all reviews that matches doc.reviewsId that in campground that we want to delete it.
          await Review.deleteMany({
              _id: {
                  $in: doc.reviews
              }
          })
      }
});
module.exports = mongoose.model('Campground', CampgroundSchema);