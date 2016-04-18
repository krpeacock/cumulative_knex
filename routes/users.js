const express = require('express');
const passport = require('passport');
const flash    = require('connect-flash');
const session  = require('cookie-session');
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const authHelpers = require('../helpers/authHelpers');
const passwordHelpers = require('../helpers/passwordHelpers');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

router.use(authHelpers.currentUser);
router.use(authHelpers.ensureAuthenticated)


/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('users').then((users) => {
    res.render('users/index', {users})
  })
});

router.get('/profile', function(req, res, next){
    res.render('users/profile', {user: req.user});
})



router.get('/:id', function(req, res, next) {
  knex('users').where('id', +req.params.id).first().then((user) => {
    res.render('users/show');
  })
})

router.get('/:id/edit', function(req, res, next){
  res.render('users/edit', {user: req.user});
})

router.put('/:id', function(req, res, next) {
  passwordHelpers.editUser(req).then((user) => {
    res.redirect('/users/profile');
  });
});

router.delete("/:id", function(req,res,next){
  knex('users').where('id', +req.params.id).first().del().then(() => {
    req.session = null;
    res.redirect('/');
  })
})

module.exports = router;
