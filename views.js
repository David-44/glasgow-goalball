'use strict';

let views = {

  index : {
    template: "index",
    pageTitle: "Home",
    pageContent: "Goalball Glasgow is a club of goalball, a paralympic sport played around the world by people with visual impairments.",
    currentMenu: "Home",
    mainTitle: 'Welcome <span class="visually-hidden-small">to Glasgow Goalball</span></h1>'
  },

  about : {
    template: "about",
    pageTitle: "About",
    pageContent: "Goalball Glasgow is a club of goalball, a paralympic sport played around the world by people with visual impairments.",
    currentMenu: "About Us",
    mainTitle: 'About<span class="visually-hidden-small"> Glasgow Goalball</span><span aria-hidden="true" class="hidden-large"> Us</span>'
  },

  sport : {
    template: "sport",
    pageTitle: "What is Goalball",
    pageContent: "Goalball was formed in 1946 by an Austrian and German man to assist the rehabilitation of visually impaired war veterans, it progressed to become a Paralympics sport in 1980.",
    currentMenu: "Goalball",
    mainTitle: '<span class="visually-hidden-small">About </span>Goalball'
  },

  contact : {
    template: "contact",
    pageTitle: "Contact Us",
    pageContent: "Contact Glasgow Goalball and come to practice with us.",
    currentMenu: "Contact",
    mainTitle: 'Contact Us',
    messageSent: false, // sets to true if emails have been sent without error
    error: false, // sets to true if the emails were not sent
    emailValid: true // sets an error message if the email has not been validated
  },

  login : {
    template: "login",
    pageTitle: "Login Window",
    pageContent: "Login window to the administrative page of Glasgow Goalball.",
    currentMenu: "none",
    mainTitle: 'Please Login',
    wrongCredentials: false,
    dbErrorMessage: false,
    noSidebar: true
  },

  admin : {
    template: "admin",
    pageTitle: "Admin Page",
    pageContent: "Administrative page of Glasgow Goalball.",
    currentMenu: "none",
    mainTitle: 'Please Login',
    dbErrorMessage: false,
    noSidebar: true,
    noHeader : true
  },


  // Initialisation of the app.locals file used by EJS templates
  // arguments are a handle to the express app and a handle to the ejs module
  init : function(app, ejs) {

    app.locals = {

      // site menus used by navigation bars
      menus : [["Home", "index"], ["About Us", "about"], ["Goalball", "sport"], ["Contact", "contact"]],

    // writes a small message if login check went wrong (used by login page)
      checkCredentials: function(wrongCredentials) {
        if (wrongCredentials) {
          return ejs.render('<p class="bold-font">username and password do not match, please try again.</p>');
        }
      },

    // writes a small message if there was an error accessing the database
    // Used on credentials and blog controllers
      dbError: function(dbErrorMessage) {
        if (dbErrorMessage) {
          return ejs.render('<p class="bold-font">Error contacting the database, please contact the administrator</p>');
        }
      },

    // writes a small message regarding the status of message sent (message sent, error or invalid email)
    // Used on contact page
      renderContact: function() {
        if (views.contact.messageSent) {
          return ejs.render('<p class="bold-font">Thank you! Your message has been sent, we will come back to you shortly.</p>');
        } else if (views.contact.error) {
          return ejs.render('<p class="bold-font">There was an error sending the message, plase try again later or send us an email to <a href="mailto://GlasgowGoalball@outlook.com">GlasgowGoalball@outlook.com</a></p>');
        } else if (!views.contact.emailValid) {
          return ejs.render('<p class="bold-font">The email address provided is not correct, please try again.</p>');
        } else {
          return ejs.render('<p>If you want to be in touch, you can either send us an email at <a href="mailto://GlasgowGoalball@outlook.com">GlasgowGoalball@outlook.com</a> or fill the form below.</p>');
        }
      }
    };
  }

}


module.exports = views;
