const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

router.route('/register')
  .get(users.renderRegister) // User get method of register 
//User post method of register .
// catchAsync is here to catch any error and send to errorHandler, 
// But here we gonna display out own message from catchAsync if there are any errors.
  .post( catchAsync(users.register))

router.route('/login')
  .get( users.renderLogin) //User login routes.
// passport.authenticate() --> is middleware that authenticate the request,
// failureFlash: true --> it flash message for us .
// failureRedirect: '/login' --> redirect to login form if the user is not authenticated. 
  .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) ,users.login)

//logout route
router.get('/logout', users.logout);

module.exports = router;