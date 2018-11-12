const Router = require('express').Router();
const ejs = require('ejs');
const path = require('path');
const createError = require('http-errors');

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/admin/login');
};

// Home
Router.all('/', isLoggedIn, require('./home.controller'));

// Login
Router.use('/login', require('./login.controller'));

// Register
Router.use('/register', require('./register.controller'));

// Posts
Router.use('/posts', isLoggedIn, require('./posts.controller'));

// Pages
Router.use('/pages', isLoggedIn, require('./pages.controller'));

// Categories
Router.use('/categories', isLoggedIn, require('./categories.controller'));

// Users
Router.use('/users', isLoggedIn, require('./users.controller'));

// Settings
Router.use('/settings', isLoggedIn, require('./settings.controller'));

// Logout
Router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/admin');
});

Router.use((req, res, next) => {

  // if template isn't set, pass this step
  if (res.locals.template == undefined) return next(createError(404));

  try {
    // template file path
    let templateFile = path.resolve('admin', 'views', res.locals.template);
    // render the template file
    ejs.renderFile(templateFile, res.locals.data, { delimiter: '%' }, (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  } catch (err) {
    next(err);
  }

});

// error handler
Router.use((err, req, res, next) => {

  return res.redirect('/admin');

  /*// Template
  res.locals.template = 'error';

  // Data
  res.locals.data = {
    page: { title: err.message },
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');*/
});

module.exports = Router;