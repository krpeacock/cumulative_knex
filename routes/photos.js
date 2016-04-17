const express = require('express');
const passport = require('passport');
const flash    = require('connect-flash');
const session  = require('cookie-session');
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const authHelpers = require('../helpers/authHelpers');
const passwordHelpers = require('../helpers/passwordHelpers');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router({mergeParams: true});

router.use(authHelpers.currentUser);
router.use(authHelpers.ensureAuthenticated)

router.get('/new', function(req, res, next) {
  knex('users').where("id", +req.user.id).then(()=>{
    res.render('photos/new',{user: req.user});
  })
});

router.get('/:id', function(req, res, next) {
  knex('users').where('id', +req.params.user_id).first().then((user)=> {
    knex('photos').where('id', +req.params.id).first().then((photo)=> {
      res.render('photos/show', {user, photo});
    })
  })
})

router.get('/:id/edit', function(req, res, next) {
  knex('users').where('id', +req.params.user_id).first().then((user)=> {
    knex('photos').where('id', +req.params.id).first().then((photo)=> {
      res.render('photos/edit', {user, photo});
    })
  })
})

router.post('/', authHelpers.ensureCorrectUserForPost, function(req, res, next) {
  knex('photos').insert({user_id: +req.params.user_id, ref: req.body.ref}).then(()=>{
    res.redirect('/users/profile');
  })
})

router.put('/:id', authHelpers.ensureCorrectUserForPost, function(req, res, next) {
  knex('photos').where('id', +req.params.id).update({ref: req.body.ref}).then(()=>{
    res.redirect(`/users/${req.params.user_id}`)
  })
})

router.delete('/:id', authHelpers.ensureCorrectUserForPost, function(req, res, next) {
  knex('photos').where('id', +req.params.id).del().then(()=>{
    res.redirect(`/users/${req.params.user_id}`)
  })
})


module.exports = router;
