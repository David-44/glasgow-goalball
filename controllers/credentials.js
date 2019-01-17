'use strict';

let bcrypt = require("bcrypt"),

  models = require('../models'),
  blog = require('./blog');




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
        res.render('login', { wrongCredentials: true });
        return;
      }

      // if the user exists, compare the crypted passwords
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) { return console.log(err); }
        if (isMatch) {

          // adds a session username and launch the admin page
          req.session.username = username;
          blog.blogRender(function(articles){
            res.render('admin', {articles: articles});
          });

          // if the password is wrong, sending wrng credentials message
        } else {
          res.render('login', { wrongCredentials: true });
          return;
        }
      });
    });
  }

};



module.exports = credentials;
