const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn,validateCampground, isAuth } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const { populate } = require("../models/campground");
const multer = require("multer"); // for using multipart/forms (to upload multi files for image).
const { storage } = require("../cloudinary");
const upload = multer({  storage }); // here we told multer to storage images in storage that in cloudinary (folder:YelpCamp) that where we store images.


router.route('/')
  .get(catchAsync( campgrounds.index))//get all campgrounds-- index function.
  .post( isLoggedIn, upload.array('image') , validateCampground,catchAsync( campgrounds.createCampground ))//to post campground -- post function.
  
//creat new campground --  create function
router.get('/new' , isLoggedIn , campgrounds.renderNewForm);

//edit campground -- get edit function
router.get('/:id/edit' , isLoggedIn, isAuth, catchAsync(campgrounds.renderEditForm));

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground) ) //to show specific campground-- show function
  .put(isLoggedIn, isAuth, upload.array('image') , validateCampground,catchAsync(campgrounds.updateCampground)) //edit campground -- put function
  .delete(isLoggedIn, isAuth, catchAsync( campgrounds.deleteCampground))//delete campground -- delete function



module.exports = router;