const express = require('express'),
    path = require('path'),
    ejs = require('ejs'),
    mailer = require('express-mailer'),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    bcrypt = require("bcrypt"),
    session = require("express-session"),
    multer = require("multer"),
    cloudinary = require('cloudinary');
    upload = multer({ dest: './static/blog/' }),
    dotenv = require('dotenv');

    dotenv.load();



/*********************** Initialisation ********************/

let port = process.env.PORT;

let app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

// Static files (CSS, images and client side javascript)
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



/********************* Helper functions *******************/

let addZero = function(num){
  if (num.toString().length == 1) {num = "0" + num;}
  return num;
};

let formatDate = function(date) {
  return addZero(date.getDate()) +"/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear();
}



/*********************** EJS functions ********************/

app.locals = {
  checkCredentials  : function(credentials) {
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




/********************* database operations ****************/

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User Authentication Schema
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});
let User = mongoose.model('User', UserSchema);

// Blog post Schema
let BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  }
});
let Blog = mongoose.model('Blog', BlogSchema);




/******************** email Init ***********************/

mailer.extend(app, {
  from: 'glasgowgoalball@gmail.com',
  host: process.env.SMTP, // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_SECRET
  }
});

// parameters used when loading the contact page
let contactParameters = {
  messageSent: false,
  error: false
};




/******************* Server start ************************/

app.listen(port, () => {
    console.log('Server listing on ' + port);
});





/*********************** Get Routes ***************************/

app.get(['/', '/index'], function(req, res) {
  blogRender(function(articles){
    res.render('index', {articles: articles});
  });

});

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/contact', function(req, res) {
    res.render('contact', contactParameters);
});

app.get('/sport', function(req, res) {
    res.render('sport');
});

app.get('/admin', function(req, res){
  if (req.session.username ) {
    blogRender(function(articles){
      res.render('admin', {articles: articles});
    });
  } else {
    res.render('login', { wrongCredentials : false });
  }
});

app.get('/logout', function(req, res){
  req.session.destroy(function(err){
    if (err) { throw err };
    res.render('login', { wrongCredentials : false });
  });
});




/**************** Admin Authentication *********************/

app.post('/admin', function(req, res){
  let username = req.body.username,
      password = req.body.password;

  User.findOne( { username: username }, function(err, user) {
    if (err) { throw err };
    if ( user == null ) {
      res.render('login', { wrongCredentials: true });
      return;
    }
    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (err) {return console.log(err)};
      if (isMatch) {
        req.session.username = username;
        blogRender(function(articles){
          res.render('admin', {articles: articles});
        });
      } else {
        res.render('login', { wrongCredentials: true });
        return;
      }
    });
  });

});




/******************* Sending emails ************************/

app.post('/email', function(req, res){
  let email = req.body.email,
       name = req.body.name,
      phone = req.body.phone,
  condition = req.body.condition,
       text = req.body.text;

  app.mailer.send('email-admin', {
    to: 'glasgowgoalball@gmail.com',
    subject: "message from " + name,
    replyTo: email,
    phone: phone,
    condition: condition,
    sender: email,
    body: text
  }, function (err) {
    if (err) {
      console.log(err);
      contactParameters.error = true;
      res.render('contact', contactParameters);
      return;
    }
  });

  app.mailer.send('email-member', {
    to: email,
    subject: 'Message from the Glasgow Goalball Team'
  }, function (err) {
    if (err) {
      console.log(err);
      contactParameters.error = true;
      res.render('contact', contactParameters);
      return;
    }
  });

  contactParameters.messageSent = true;
  res.render('contact', contactParameters);
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
      blogPost.save(function(err, blog){
        if (err) {throw(err);}
        blogRender(function(articles){
          res.render('admin', {articles: articles});
        });
      });

    });
  }
});



// Formatting a post from the database
let blogRender = function(callback, options) {
  let query = Blog.find().sort({date : -1});
  query.exec(function(err, blogs) {
    let articles = blogs.map(function(blog){
      let datetime = blog.date.getFullYear() + "-" + addZero(blog.date.getMonth() + 1) + "-" + addZero(blog.date.getDate());

      let article = '<article class="news-article article" role="region">';
      article += '<h3 class="section-subtitle">' + blog.title;
      article += '<time class="article-date" datetime="' + datetime + '">' + formatDate(blog.date) + '</time></h3>';
      article +='<p>' + blog.text.replace(/\r?\n/g, '<br />') + '</p>'

      if (blog.image) {
        article += '<img class="blog-image" alt="" src="' +blog.image + '">'
      }

      article += '</article>';

      return article;

    });
    callback(articles.join(""));
  });
};
