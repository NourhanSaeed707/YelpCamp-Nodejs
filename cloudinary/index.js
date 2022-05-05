const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_KEY,
   api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    //this cloudinary objects that we just configured.
    cloudinary,
    params: {
        folder: 'YelpCamp', // that folder in cloudinary that we store images in it.
        allowedFormats: ['jpeg' , 'png' ,'jpg']
    }
});
module.exports = {
    cloudinary, storage
}