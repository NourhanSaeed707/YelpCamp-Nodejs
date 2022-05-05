const User = require("../models/user");

//renderRegister function --> form for register user.
module.exports.renderRegister =  (req, res) =>{
    res.render("users/register");
}

//register function --> to register user , save information of user in users document.
module.exports.register = async(req, res) =>{
    try{
    // here we extract user's email, username ,password from req.body from from.
        const {email, username, password} = req.body;
    // here we create a new user by making new model and send username and email and make instance;
        const user = new User({email, username});
    // register method --> we sending instance of User Model and password and it will hash the password and
    // add its salt and hash to the password to our new user.
        const registeredUser = await User.register(user, password);
    // here to login after the user registered and this function take callback function (err).
        req.login(registeredUser, err =>{
            if(err){
                return next(err);
            }
            req.flash('success', "Welcom To Yelp Camp");
            res.redirect("/campgrounds");
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

//renderLogin function --> login form
module.exports.renderLogin = (req, res) =>{
    res.render("users/login");
}

//login function --> to login user
module.exports.login = (req, res) =>{
    // so here it's mean that the user is authenticated so we display flash message and redirect to campgrouds 
        req.flash('success', 'Welcom Back');
    // here we get the stored valute returnTo if it there if not then we redirect to '/campground'.
        const redirectURL = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;  // delete session(returnTo) after we use it 
        res.redirect(redirectURL);
}

//logout function --> to logout user
module.exports.logout = (req, res) => {
    // req.logOut() --> here we use passport method to logout.
        req.logOut();
        req.flash("success", 'GoodBye!');
        res.redirect("/campgrounds");
}