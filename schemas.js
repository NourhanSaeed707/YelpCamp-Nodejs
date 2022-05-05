//here we use schemas file to validate data of campgrounds so 
//we cann't submit empty data or invalide from postman(server side), or from user side (form).
// so we use joi library to prevent that.
const Joi = require("joi");

//campground validation using joi library.
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

// review validation using joi library.
module.exports.reviewSchema = Joi.object({
   review: Joi.object({
       rating: Joi.number().required().min(1).max(5),
       body: Joi.string().required()
   }).required()
});