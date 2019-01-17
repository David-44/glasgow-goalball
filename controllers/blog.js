'use strict';

let models = require('../models');



/********************* Helper functions *******************/

let addZero = function(num){
  if (num.toString().length == 1) {num = "0" + num;}
  return num;
};

let formatDate = function(date) {
  return addZero(date.getDate()) +"/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear();
}



/************************ Module **********************/

let blog = {

  // renders all the blogposts in an array and passes the array to a callback functions
  blogRender : function(callback) {
    models.getBlog(function(err, blogs){

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
      callback(articles.join(""));
    });

  }

};



module.exports = blog;
