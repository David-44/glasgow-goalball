'use strict';

const cloudinary = require('cloudinary'),
    models = require('../models'),
    views = require('../views');



/********************* Helper functions *******************/

// takes an integer as parameter, adds a leading 0 if it contains only one digit
const addZero = function (num) {
  if (num.toString().length == 1) { num = '0' + num; }
  return num;
};

// takes a date object and formats it using british convention (heroku doesn't take GB locals)
const formatDate = function (date) {
  return addZero(date.getDate()) + '/' + addZero(date.getMonth() + 1) + '/' + date.getFullYear();
}




/************************ Module **********************/

const blog = {



  // renders all the blogposts and passes them as articles to the correct body
  // the structure of blogposts is described in the models module (required)
  // view is the view being rendered, property from the views object (required)

  blogRender: function (view, res) {
    models.getBlog(function (err, blogs) {

      let articles = '';

      // In case of an error getting the blogs, render the view normally with no article
      // and log the error
      if (err) {
        console.log(err);
        res.render('layout', view);
        return;
      }

      // builds the articles array of html strings
      articles = blogs.map((blog) => {
        let datetime = blog.date.getFullYear() + '-' + addZero(blog.date.getMonth() + 1) + '-' + addZero(blog.date.getDate());

        let article = '<article class="news-article article" role="region">';
        article += '<h3 class="section-subtitle">' + blog.title;
        article += '<time class="article-date" datetime="' + datetime + '">' + formatDate(blog.date) + '</time></h3>';
        article += '<p>' + blog.text.replace(/\r?\n/g, '<br />') + '</p>';

        if (blog.image) {
          article += '<img class="blog-image" alt="" src="' + blog.image + '">';
        }

        article += '</article>';

        return article;

      });

      view.articles = articles.join('');
      res.render('layout', view);
      return;
    });

  },



  // saves a blog to the Blog model. Requires coudinary to be set
  postBlog: function (req, res) {
    let now = new Date(),
    blogPost = new models.Blog({
      title: req.body.title,
      text: req.body.text,
      date: now
    });

    // check if a file should be uploaded
    if (req.file) {
      let filename = req.file.filename;
      // cloudinary options: cloudinary folder and file format
      let options = {
        folder: 'goalball',
        width: 1000,
        crop: 'fit',
        format: 'jpg'
      };

      cloudinary.v2.uploader.upload('./static/blog/' + filename, options, function(err, result) {
        if (err){
          models.dbError(err, res, views.admin);
          return;
        }
        // assigns the path of the image to the blog post
        blogPost.image = result.url;

        // registers the blog into the database
        blogPost.save(function (err) {
          if (err) {
            models.dbError(err, res, views.admin);
          }
          res.redirect('admin');
          return;
        });
      });
    } else {
      blogPost.save(function (err) {
        if (err) {
          models.dbError(err, res, views.admin);
        }
        res.redirect('admin');
        return;
      });
    }
  }


};



module.exports = blog;
