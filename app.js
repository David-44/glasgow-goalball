'use strict';

const express = require('express'),
    path = require('path'),
    ejs = require('ejs'),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    session = require("express-session"),
    multer = require("multer"),
    cloudinary = require('cloudinary'),
    upload = multer({ dest: './static/blog/' }),
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
email.init(app); // initialises the email (see email.js)
app.use(bodyParser.urlencoded({
    extended: true
}));

// css, script and images
app.use(express.static(__dirname + "/static"));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 3600000
  }
}));

app.use('/', routes);





/*********************** EJS functions ********************/

app.locals = {
  checkCredentials: function(credentials) {
    if (credentials) {
      return ejs.render('<p class="bold-font">username and password do not match, please try again.</p>');
    }
  }
};





/*********************** Cloudinary ***********************/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});




/********************* database initialisation ****************/

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
models.init(mongoose);





/******************* Server start ************************/

app.listen(port, () => {
    console.log('Server listing on ' + port);
});





/****************** Blog operations ************************/

// Create Blog post in the database
app.post('/blogcreate', upload.single('image'), function(req,res) {
  let now = new Date(),
  blogPost = new Blog({
    title : req.body.title,
    text : req.body.text,
    date : now
  });

  if (req.file) {
    let filename = req.file.filename;
    let options = {
      folder: "goalball",
      format: "jpg"
    };
    cloudinary.v2.uploader.upload("./static/blog/" + filename, options, function(err, result) {
      if (err){throw(err);}
      blogPost.image = result.url;
      blogPost.save(function(err){
        if (err) {throw(err);}
        res.redirect('admin');
      });

    });
  } else {
    blogPost.save(function(err){
      if (err) {throw(err);}
      res.redirect('admin');
    });
  }


});
