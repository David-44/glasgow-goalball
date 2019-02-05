'use strict';

// Normally there should be one model for each collection, but it is a small app...



// user representation
let user = {
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
},



// blog representation
blog = {
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
};



/*********************** modules **************************/

const models = {

  // models and schema properties
  userSchema : null,
  blogSchema : null,
  User : null, // to be used only for authentication
  Blog : null, // blog model, to be used with blog CRUD

  // Initialises all the models
  // the parameter mongoose is a handler to an instance of the mongoose object
  init : function(mongoose) {
    this.userSchema = new mongoose.Schema(user);
    this.blogSchema = new mongoose.Schema(blog);
    this.User = mongoose.model('User', this.userSchema);
    this.Blog = mongoose.model('Blog', this.blogSchema);
    return;
  },



  // gets the user by username and passes it to callback(err, user)
  getUser : function(username, callback) {
    this.User.findOne( { username: username }, callback);
    return;
  },



  // gets all the blog entries and passes them to callback(err, blogs)
  getBlog : function(callback) {
    let query = this.Blog.find().sort({date : -1});
    query.exec(callback);
    return;
  },


  // deals with errors accessing the database or cloudinary
  // takes as parameter, the error and response objects
  // and the view object from the view module which should render the view error
  dbError : function(err, res, view) {
    console.log(err);
    view.dbErrorMessage = true;
    res.redirect('/admin');
    return;
  }


};



module.exports = models;
