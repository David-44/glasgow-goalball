'use strict';

const bcrypt = require('bcrypt'),

    models = require('../models'),
    blog = require('./blog'),
    views = require('../views');


// adds the wrong login sentence when credentials are wrong
// takes the response object as parameter
const wrongLogin = function (res) {
  views.login.wrongCredentials = true;
  res.render('layout', views.login);
  return;
};



const credentials = {

  // authenticates user, requires bcrypt and the session middleware to be setup
  authenticate: function(req, res) {

    // get credentials from the request body
    if (!req.body.username || !req.body.password) {
      wrongLogin(res);
      return;
    }
    let username = req.body.username,
        password = req.body.password;

    // try to get the matching user if it exists
    models.getUser(username, function(err, user) {
      if (err) {
        models.dbError(err, res, views.login);
        return;
      }

      // if user doesn't exist, back to login window with wrong credentials
      if (user == null) {
        wrongLogin(res);
        return;
      }

      // if the user exists, compare the crypted passwords
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) {
          models.dbError(err, res, views.login);
          return;
        }
        if (isMatch) {

          // adds a session username and launch the admin page
          req.session.username = username;
          views.login.wrongCredentials = false;
          blog.blogRender(views.admin, res);
          return;

        // if the password is wrong, sending wrong credentials message
        } else {
          wrongLogin(res);
          return;
        }
      });
    });
  }

};



module.exports = credentials;
