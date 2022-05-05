// here we will take function from app file and return function that handle error of that function
// that passed from app file to avoid using try and catch. 
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}