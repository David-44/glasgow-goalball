'use strict';

const mailer = require('express-mailer'),
    views = require('../views');


// the email recipient, can go to a global config file in a large app, fine here in a small app
const recipient = 'GlasgowGoalball@outlook.com';


// function that deals with email errors
// needs to be passed the error and response objects
const emailError = function(err, res) {
  console.log(err);
  views.contact.error = true;
  res.render('layout', views.contact);
  return;
};


// checks for presence (used for form validation)
const isPresent = function(str) {
  return (str != undefined);
};


// email validation, regexp shamelessly borrowed from
// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validateEmail = function(email) {
  let re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (isPresent(email)) {
    return re.test(String(email).toLowerCase());
  }
};





// module to be exported
const mail = {

  // the Express app, set during initialisation
  app : null,



  // Initialising the mailer and setting the app
  init: function(app) {
    mailer.extend(app, {
      from: recipient,
      host: process.env.SMTP,
      secureConnection: true,
      port: 465,
      transportMethod: 'SMTP',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_SECRET
      }
    });

    this.app = app;
  },



  // parses the body of the post request, sends the emails and renders contact
  // use with bind when used inside a router or event
  sendMail: function(req, res) {

    // test necessary because mail.app is initialised after mail.sendMail is parsed
    if (this.app){
      let email, name, phone, condition, body;

      // Validation, to keep it extra simple we validate only the email
      if (validateEmail(req.body.email)) {
        email = req.body.email,
        name = req.body.name,
        phone = req.body.phone,
        condition = req.body.condition,
        body = req.body.text;
      } else {
        views.contact.emailValid = false;
        res.render('layout', views.contact);
        return;
      }

      // sends email to recipient
      this.app.mailer.send('./email/recipient', {
        phone,
        condition,
        body,
        to: recipient,
        subject: 'message from ' + name,
        replyTo: email,
        sender: email
      }, function (err) {
        if (err) {
          emailError(err, res);
          return;
        }
      });

      // sends email to member
      this.app.mailer.send('./email/member', {
        to: email,
        subject: 'Message from the Glasgow Goalball Team'
      }, function (err) {
        if (err) {
          emailError(err, res);
          return;
        }
      });

      // renders the page with the thank you message if there is no error
      views.contact.messageSent = true;
      res.render('layout', views.contact);
      return;
    }
  }

};



module.exports = mail;
