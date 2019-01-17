'use strict';

let mailer = require('express-mailer');

//
let recipient = 'glasgowgoalball@gmail.com';



// module to be exported
let mail = {
  // the Express app, set during initialisation
  app : null,

  // variables used to add to the 'contact' template
  contactParameters : {
    messageSent: false, // sets to true if emails have been sent without error
    error: false // sets to true if the emails were not sent
  },



  // Initialising the mailer and setting the app
  init : function(app) {
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
  // for some reasons, the keyword "this" returns undefined in this method, so "mail" is used instead
  sendMail : function(req, res) {

    // test necessary because mail.app is initialised after mail.sendMail is parsed
    if (mail.app){

      try {
        let email = req.body.email,
             name = req.body.name,
            phone = req.body.phone,
        condition = req.body.condition,
             text = req.body.text;

    // sends email to recipient
        mail.app.mailer.send('email-admin', {
          to: recipient,
          subject: "message from " + name,
          replyTo: email,
          phone: phone,
          condition: condition,
          sender: email,
          body: text
        }, function (err) {
          if (err) { throw err; }
        });

    // sends email to member
        mail.app.mailer.send('email-member', {
          to: email,
          subject: 'Message from the Glasgow Goalball Team'
        }, function (err) {
          if (err) { throw err; }
        });

    // if no error, sets messageSent to write a message in the template
        mail.contactParameters.messageSent = true;

      } catch(err) {
        console.log(err);
        mail.contactParameters.error = true;
      } finally {
        res.render('contact', mail.contactParameters);
      }
    }
  }

};



module.exports = mail;
