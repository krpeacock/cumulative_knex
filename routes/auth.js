const express = require('express');
const passport = require('passport');
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const authHelpers = require('../helpers/authHelpers');
const passwordHelpers = require('../helpers/passwordHelpers');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req,res,next) {
  res.render('login', {message: req.flash('loginMessage'), val: "Login"});
});

router.get('/signup', function(req, res, next){
  res.render('signup', {message: req.flash('loginMessage')});
});

router.get('/logout', (req,res) =>{
 req.logout();
 res.redirect('/login');
});

router.get('/auth/linkedin', 
  passport.authenticate('linkedin'));

router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/users',
  failureRedirect: '/auth/login',
}));


router.post('/signup', (req, res) => {
  passwordHelpers.createUser(req).then((user) => {
    // passport.authenticate('local', (err, user) =>{
    //   if (err){
    //     return next(err);
    //   }
    //   if (!user){
    //     return res.redirect('/signup');
    //   }
      req.login(user[0], (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect(`/users/${user.id}/edit`);
      })
      // })
    }).catch((err) =>{
      if(err.constraint === 'users_email_unique'){
        err.message = 'email is already taken'
      }
      if(err) {
        req.flash('loginMessage', err.message)
        res.redirect('/signup');
      }
      else {
        res.render('error', {err})
      }
    })
  });

router.post('/login',
  passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login'
}));

module.exports = router;
