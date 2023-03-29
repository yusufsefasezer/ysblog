const Router = require('express').Router();
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Register
Router.get('/', (req, res, next) => {

  if (req.user) return res.redirect('/admin');

  // Template
  res.locals.template = 'register.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Register' },
    message: req.flash('registerMessage')
  };

  next();
});

// Register
Router.post('/', passport.authenticate('register', {
  successRedirect: '/admin',
  failureRedirect: '/admin/register',
  failureFlash: true
}));

// Register Strategy
passport.use('register', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
}, async (req, email, password, done) => {

  // check the email.
  if (!User.validEmail(email))
    return done(null, false, req.flash('registerMessage', 'Please enter a valid email adress.'));

  // check the password.
  if (password === undefined || password.length < 6)
    return done(null, false, req.flash('registerMessage', 'Password must be at least 6 characters.'));

  // check the name.
  if (req.body.fname === undefined)
    return done(null, false, req.flash('registerMessage', 'Name is required.'));

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  let foundUser = null;
  try {
    foundUser = await User.findOne({ email: email });
  } catch (error) {
    // if there are any errors, return the error
    return done(error);
  }

  // check to see if there's already a user with that email
  if (foundUser)
    return done(null, false, req.flash('registerMessage', 'That email is already taken.'));

  // if there's no user with that email, create the user
  var newUser = new User();

  // set the user's credentials
  newUser.email = email;
  newUser.password = User.md5(password);
  newUser.fname = req.body.fname;

  // save the user
  try {
    await newUser.save();
  } catch (error) {
    // if there are any errors, return the error
    return done(error);
  }
  return done(null, newUser);
}));

module.exports = Router;