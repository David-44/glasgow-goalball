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
  }

}


module.exports = views;
