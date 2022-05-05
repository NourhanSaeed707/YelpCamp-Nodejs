const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '62692d057f588237e6807148',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam alias eos vitae provident cupiditate consectetur quis. Non, architecto. Accusamus asperiores reiciendis laborum ea illum voluptates ut, amet temporibus inventore aut!',
            price,
            geometry: { type: 'Point', coordinates: [ 
                cities[random1000].longitude,
                cities[random1000].latitude,
              ] 
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/nourhan/image/upload/v1651357024/YelpCamp/ucwjybjkpqs9hjdsvyfd.webp',
                  filename: 'YelpCamp/ucwjybjkpqs9hjdsvyfd',
                },
                {
                  url: 'https://res.cloudinary.com/nourhan/image/upload/v1651357024/YelpCamp/z1grcd8nxol6jo91b2ah.jpg',
                  filename: 'YelpCamp/z1grcd8nxol6jo91b2ah',
                }
              ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})