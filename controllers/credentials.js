'use strict';

let bcrypt = require("bcrypt"),

  models = require('../models'),
  blog = require('./blog'),
  views = require('../views');




let credentials = {

  // authenticates user, requires bcrypt and the session middleware to be setup
  authenticate : function(req, res) {

    // get credentials from the request body
    let username = req.body.username,
      password = req.body.password;

    // try to get the matching user if it exists
    models.getUser( username, function(err, user) {
      if (err) { return console.log(err); }

      // if user doesn't exist, back to login window with wrong credentials
      if ( user == null ) {
        views.login.wrongCredentials = true;
        res.render('layout', views.login);
        return;
      }

      // if the user exists, compare the crypted passwords
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) { return console.log(err); }
        if (isMatch) {

          // adds a session username and launch the admin page
          req.session.username = username;
          views.login.wrongCredentials = false;
          blog.blogRender(function(articles){
            views.admin.articles = articles;
            res.render('layout', views.admin);
          });

          // if the password is wrong, sending wrng credentials message
        } else {
          views.login.wrongCredentials = true;
          res.render('layout', views.login);
          return;
        }
      });
    });
  }

};



module.exports = credentials;
