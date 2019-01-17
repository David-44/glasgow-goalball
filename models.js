'use strict'

// Normally there should be one model for each collection, but it is a small app

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

// to be exported
const models = {

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
  },


  // gets all the blog entries and passes them to callback(err, blogs)
  getBlog : function(callback) {
    let query = this.Blog.find().sort({date : -1});
    query.exec(callback);
    return;
  }
};



module.exports = models;
