const express = require('express'),
    path = require('path'),
    ejs = require('ejs'),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    bcrypt = require("bcrypt"),
    session = require("express-session"),
    multer = require("multer"),
    cloudinary = require('cloudinary');
    upload = multer({ dest: './static/blog/' }),
    dotenv = require('dotenv'),

    email = require('./controllers/email'),
    routes = require('./routes');





/*********************** Initialisation ********************/

dotenv.load();
let port = process.env.PORT;

let app = express();
app.set('view engine', 'ejs');
email.init(app);
app.use(bodyParser.urlencoded({
    extended: true
}));

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





/******************* Server start ************************/

app.listen(port, () => {
    console.log('Server listing on ' + port);
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
