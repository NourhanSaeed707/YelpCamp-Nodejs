const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});
//this is gonna add to our schema a username and make sure username unique they're not duplicated,
// and it's gonna add field of password. it also adds some additional methods that we can use.

// Passport-Local Mongoose -->will add a username,
// hash and salt field to store the username, the hashed password and the salt value.and add some methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);