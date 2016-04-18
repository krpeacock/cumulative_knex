const express = require('express');
const passport = require('passport');
const flash    = require('connect-flash');
const session  = require('cookie-session');
const knex = require('../db/knex');
const authHelpers = require('../helpers/authHelpers');
const passwordHelpers = require('../helpers/passwordHelpers');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

router.use(authHelpers.currentUser);
router.use(authHelpers.ensureAuthenticated);

router.get('/', function(req,res){
  knex('posts').then((posts) => {
    res.render('posts/index', {posts, user: req.user});
  });
});

module.exports = router;