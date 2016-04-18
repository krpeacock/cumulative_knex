const express = require('express');
const passport = require('passport');
const flash    = require('connect-flash');
const session  = require('cookie-session');
const knex = require('../db/knex');
const authHelpers = require('../helpers/authHelpers');
const passwordHelpers = require('../helpers/passwordHelpers');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router({mergeParams: true});

router.use(authHelpers.currentUser);
router.use(authHelpers.ensureAuthenticated);

router.get('/', function(req,res){
  knex('posts').where({user_id: +req.params.user_id}).then((posts) => {
    knex('users').where({id: +req.params.user_id}).then((user)=>{
      res.render('posts/index', {posts, user});
    });
  });
});

router.get('/new', function(req, res){
  if(req.user.id === +req.params.user_id){
    res.render('posts/new', {user: req.user});
  }
  else {
    res.redirect(`/users/${+req.params.user_id}/posts`);
  }
});

module.exports = router;