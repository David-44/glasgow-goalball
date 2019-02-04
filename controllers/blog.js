'use strict';

let cloudinary = require('cloudinary'),
  models = require('../models');



/********************* Helper functions *******************/

// takes an integer as parameter, adds a leading 0 if it contains only one digit
let addZero = function(num){
  if (num.toString().length == 1) {num = "0" + num;}
  return num;
};

// takes a date object and formats it using british convention (heroku doesn't take GB locals)
let formatDate = function(date) {
  return addZero(date.getDate()) +"/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear();
}



/************************ Module **********************/

let blog = {



  // renders all the blogposts and passes them as articles to the correct body
  // requires the views Module
  // view is the property from the views object

  blogRender : function(view, res) {
    models.getBlog(function(err, blogs){

      if (err) {
        throw err;
      }

      let articles = blogs.map(function(blog){
        let datetime = blog.date.getFullYear() + "-" + addZero(blog.date.getMonth() + 1) + "-" + addZero(blog.date.getDate());

        let article = '<article class="news-article article" role="region">';
        article += '<h3 class="section-subtitle">' + blog.title;
        article += '<time class="article-date" datetime="' + datetime + '">' + formatDate(blog.date) + '</time></h3>';
        article +='<p>' + blog.text.replace(/\r?\n/g, '<br />') + '</p>'

        if (blog.image) {
          article += '<img class="blog-image" alt="" src="' + blog.image + '">'
        }

        article += '</article>';

        return article;

      });
      view.articles = articles.join("");
      res.render('layout', view);
    });

  },



  // saves a blog to the Blog model. Requires coudinary to be set
  postBlog : function(req, res) {
    let now = new Date(),
    blogPost = new models.Blog({
      title : req.body.title,
      text : req.body.text,
      date : now
    });

    // check if a file should be uploaded
    if (req.file) {
      let filename = req.file.filename;
      // cloudinary options: cloudinary folder and file format
      let options = {
        folder: "goalball",
        width: 1000,
        crop: "fit",
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
  }


};



module.exports = blog;
