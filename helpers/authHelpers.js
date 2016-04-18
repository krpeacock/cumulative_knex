const authMiddleware  = {
  ensureAuthenticated(req,res,next){
    console.log(req.session);
    if (!req.user){
      req.session.flash = {}
      req.flash('loginMessage', "Please log in first")
      return res.redirect('/');
    }
    else {
      return next();
    }
  },
  ensureCorrectUserForPost(req,res,next){
    if(+req.params.id === req.user.id){
      return next()
    }
    else {
      res.redirect('/users')
    }
  },
  preventLoginSignup(req, res, next) {
    if (req.user) {
      return res.redirect(`/users`);
    }
    else {
     return next();
    }
  },
  currentUser(req, res, next) {
    // if the user is authenticated (passport method returns true when serialized)
    if (req.isAuthenticated()) {
      // this is available in the view for all requests, deserializing FTW
      res.locals.currentUser = req.user;
      return next();
    }
    else {
      return next();
    }
  },
}
module.exports = authMiddleware;
