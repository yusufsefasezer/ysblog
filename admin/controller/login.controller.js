const Router = require('express').Router();
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Login
Router.get('/', (req, res, next) => {

  if (req.user) return res.redirect('/admin');

  // Template
  res.locals.template = 'login.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Log in' },
    message: req.flash('loginMessage')
  };

  next();
});

// Login
Router.post('/', passport.authenticate('login', {
  successRedirect: '/admin',
  failureRedirect: '/admin/login',
  failureFlash: true
}));

// Login Strategy
passport.use('login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
}, async (req, email, password, done) => { // callback with email and password from our form

  // check the email.
  if (!User.validEmail(email))
    return done(null, false, req.flash('loginMessage', 'Please enter a valid email adress.'));

  // check the password.
  if (password === undefined || password.length < 6)
    return done(null, false, req.flash('loginMessage', 'Password must be at least 6 characters.'));

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  await User.findOne({ 'email': email }, (err, user) => {
    // if there are any errors, return the error before anything else
    if (err) return done(err);

    // if no user is found, return the message
    if (!user)
      return done(null, false, req.flash('loginMessage', 'No user found.'));

    // if the user is found but the password is wrong
    if (!user.validPassword(password))
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

    // all is well, return successful user
    return done(null, user);
  });

}));

module.exports = Router;