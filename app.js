'use strict';

const express = require('express'),
    path = require('path'),
    ejs = require('ejs'),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    session = require("express-session"),
    cloudinary = require('cloudinary'),
    dotenv = require('dotenv'),

    models = require('./models'),
    email = require('./controllers/email'),
    blog = require('./controllers/blog'),
    routes = require('./routes');





/*********************** Initialisation ********************/

dotenv.load(); // reads local environment file
let port = process.env.PORT;

let app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

// initialises the email functionnality with sendgrid.com (see email.js)
email.init(app);

// serving css, script and images
app.use(express.static(__dirname + "/static"));

// loading express router
app.use('/', routes);




/********************* Session config **********************/

app.use(session({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 3600000
  }
}));





/*********************** EJS config ************************/

// writes a small message if login check went wrong
app.locals = {
  checkCredentials: function(credentials) {
    if (credentials) {
      return ejs.render('<p class="bold-font">username and password do not match, please try again.</p>');
    }
  }
};

// all the menus of the site
app.locals.menus = [["Home", "index"], ["About Us", "about"], ["Goalball", "sport"], ["Contact", "contact"]];





/********************* Cloudinary Config *********************/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});




/******************** database initialisation ****************/

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
models.init(mongoose);





/********************** Server start ************************/

app.listen(port, () => {
    console.log('Server listening on ' + port);
});
