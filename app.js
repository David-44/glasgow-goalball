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
    routes = require('./routes'),
    views = require('./views');





/*************** Initialisation and Middlewares *****************/

dotenv.load(); // reads local environment file
const port = process.env.PORT;

const app = express();
app.set('view engine', 'ejs');

// bodyparser used by post requests
app.use(bodyParser.urlencoded({ extended: true }));

// serving css, script and images
app.use(express.static(__dirname + '/static'));

// Session config
app.use(session({
    key: 'user_sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 3600000
    }
}));

// loading express router (should be done after session)
app.use('/', routes);




// initialises the email functionnality with sendgrid.com (see email.js)
email.init(app);

// initialises EJS variables to be passed to locals
views.init(app, ejs);





/********************* Cloudinary Config *********************/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});




/******************** database initialisation ****************/

// Used to setup the auto reconnect to fire every 5 minutes
// useNewUrlParser is a required option
const mongooseOptions = {
  useNewUrlParser: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 30000
};

// establishes connection, takes URI directly from process.env
mongoose.connect(process.env.DB_CONNECT, mongooseOptions, err => {
  if (err) {
    console.log('Unable to connect to the server. Please start the server. Error:', err);
  }
});

const db = mongoose.connection;

// disconnects on error in order to force an auto reconnect
db.on('error', error => {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

// initialises all user schemas
models.init(mongoose);





/********************** Server start ************************/

app.listen(port, () => {
  console.log('Server listening on ' + port);
});
