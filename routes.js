'use strict';

const express = require('express'),
    multer = require('multer'),
    upload = multer({ dest: './static/blog/' }),

    blog = require('./controllers/blog'),
    credentials = require('./controllers/credentials'),
    email = require('./controllers/email'),
    views = require('./views.js'),

    router = express.Router();





// GET routes

router.get(['/', '/index'], function(req, res) {
  blog.blogRender(views.index, res);
});


router.get('/about', function(req, res) {
  res.render('layout', views.about);
});


router.get('/contact', function(req, res) {
  res.render('layout', views.contact);
});


router.get('/sport', function(req, res) {
  res.render('layout', views.sport);
});

// admin checks if user is logged in
router.get('/admin', function(req, res){
  if ( req.session.username ) {
    blog.blogRender(views.admin, res);
  } else {
    res.render('layout', views.login);
  }
});


router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.render('layout', views.login);
  });
});


router.get('/email', function(req, res) {
  res.redirect('/contact');
});


// default routes, redirects to home insead of sending a 404
router.get('*',function (req, res) {
  res.redirect('/');
});





// POST requests

router.post('/email', email.sendMail.bind(email));
router.post('/admin', credentials.authenticate.bind(credentials));
router.post('/blogcreate', upload.single('image'), blog.postBlog); // requires the multer module



module.exports = router;
