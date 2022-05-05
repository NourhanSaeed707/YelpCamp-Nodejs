//here we gonna extract message and statusCode from Error class of express when there are errors
// and use these message.
class ExpressError extends Error{
    constructor(message, statusCode){
        //super constructor is gonna call Error Constructor that in express..
       super();
       this.message = message;
       this.statusCode = statusCode;
    }
}
module.exports = ExpressError;