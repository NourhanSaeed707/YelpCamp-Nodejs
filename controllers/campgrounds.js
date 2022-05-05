const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

//index function --> to show all campgrounds.
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

//renderNewForm function -->  a form to create new campground.
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

//createCampground function --> post method to save new campground .
module.exports.createCampground = async (req, res, next) => {
  //to use mapbox 
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  // here we check if there is no campground data we throw error from ExpressError
  //to next() in express middleware and send message and statusCode to it..
  // that will check if we haven't campground at all (title,location , image, etc)
  //  if(!req.body.campground) throw new ExpressError('Invalide Campground Data', 400);
  const campground = new Campground(req.body.campground);
  // here to take coordinate so we can using map 
  campground.geometry = geoData.body.features[0].geometry;
  //that will create an array that holds objects to hold (path and filename) for each image and save it in array so we can
  //save it into campground.image(model of campground that its type: array)
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id; // here user already logged in so we take his id and save it to author in campground
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground.");
  res.redirect(`/campgrounds/${campground._id}`);
};

//showCampground function --> to show specific campground
module.exports.showCampground = async (req, res) => {
  // populate so when we get campgrounds get their reviews with all info of it with it..
  const campground = await Campground.findById(req.params.id)
    .populate({
      // we populate inside review to populate with author that inside the review so we can get the author information
      // from review.
      path: "reviews",
      populate: {
        path: "author", // this line is populate for review's author info.
      },
    })
    .populate("author"); // this line is populate for campground's author info.
  // that when we get wrong id from params or when we delete campground and try to visit the same link
  // of deleted campground
  if (!campground) {
    req.flash("error", "Cannot find that campground.");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

//renderEditForm function --> form to edit campground.
module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  // that when we get wrong id from params or when we delete campground and try to visit the same link
  // of deleted campground
  if (!campground) {
    req.flash("error", "Cannot find that campground.");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

//updateCampground function --> put method to edit campground.
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map( f  => ({url: f.path, filename: f.filename}));
  // we sperate images as separate arguments to push in array.
  campground.images.push(...imgs);
  // console.log(campground);
  await campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
  //to remove images from cloudinary that we will remove it from mongodb 
      await cloudinary.uploader.destroy(filename);
    }
//$pull--> to pull (delete-remove) something out side array 
    await campground.updateOne({$pull: { images: {filename: {$in: req.body.deleteImages} } } } );
  }
  req.flash("success", "Successfully updated campground.");
  res.redirect(`/campgrounds/${campground._id}`);
};

//deleteCampground function --> to delete campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground.");
  res.redirect("/campgrounds");
};
