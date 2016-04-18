const passportLocal = require("passport-local");
const FacebookStrategy = require("passport-facebook").Strategy;
const knex = require("../db/knex");
const passwordHelpers = require("./passwordHelpers");
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
}

module.exports = (passport) => {
  passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_basicprofile'],
      state: true
  },
  function(accessToken, refreshToken, profile, done){
    done(null, {id: profile.id, displayName: profile.displayName, token: accessToken});
  }
  ));

  passport.use(new passportLocal.Strategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
    passReqToCallback : true
  },(req,email, password, done) =>{
      knex.select('users.id as id', 'identities.password', 'users.email').from('users').
      where({ email }).join("identities","user_id","users.id").first().then((user) =>{
        if (!user) {
          return done(null, false, req.flash('loginMessage','Incorrect username.'));
        }
        if(!user.password){
          return done(null, false, req.flash('loginMessage','You already has an account with facebook'));
        }
        if (!passwordHelpers.comparePass(password, user.password)) {
          return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
        }
        return done(null, user);
      }).catch((err) => {
        return done(err)
      })
    }
  ));

  passport.serializeUser((user, done) =>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>{
    knex('users').where({id}).first()
      .then((user) =>{
        done(null, user);
      }).catch((err) =>{
        done(err,null);
      });
  });
}