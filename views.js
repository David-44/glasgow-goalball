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
    mainTitle: 'Contact Us'
  },

  login : {
    template: "login",
    pageTitle: "Login Window",
    pageContent: "Login window to the administrative page of Glasgow Goalball.",
    currentMenu: "none",
    mainTitle: 'Please Login',
    wrongCredentials: false,
    noSidebar: true
  },

  admin : {
    template: "admin",
    pageTitle: "Admin Page",
    pageContent: "Administrative page of Glasgow Goalball.",
    currentMenu: "none",
    mainTitle: 'Please Login',
    wrongCredentials: false,
    noSidebar: true,
    noHeader : true
  },


  // Initialisation of the app.locals file used by EJS templates
  // arguments are a handle to the express app and a handle to the ejs module
  init : function(app, ejs) {
    // writes a small message if login check went wrong
    app.locals = {
      checkCredentials: function(wrongCredentials) {
        if (wrongCredentials) {
          return ejs.render('<p class="bold-font">username and password do not match, please try again.</p>');
        }
      }
    };

    // all the menus of the site
    app.locals.menus = [["Home", "index"], ["About Us", "about"], ["Goalball", "sport"], ["Contact", "contact"]];
  }

}


module.exports = views;
