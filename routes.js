'use strict';

const express = require('express'),
      blog = require('./controllers/blog'),
      email = require('./controllers/email'),
      router = express.Router();


router.get(['/', '/index'], function(req, res) {
  blogRender(function(articles){
    res.render('index', {articles: articles});
  });

});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/contact', function(req, res) {
    res.render('contact', email.contactParameters);
});

router.get('/email', function(req, res) {
    res.redirect('/contact');
});

router.get('/sport', function(req, res) {
    res.render('sport');
});

router.get('/admin', function(req, res){
  if ( req.session.username ) {
    blogRender(function(articles){
      res.render('admin', {articles: articles});
    });
  } else {
    res.render('login', { wrongCredentials : false });
  }
});

router.get('/logout', function(req, res){
  req.session.destroy(function(err){
    if (err) { throw err };
    res.render('login', { wrongCredentials : false });
  });
});

// POST requests

router.post('/email', email.sendMail.bind(email));



module.exports = router;
