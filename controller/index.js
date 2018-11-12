const createError = require('http-errors');
const Router = require('express').Router();
const Post = require('../models/Post');
const Category = require('../models/Category');

Router.use(async (req, res, next) => {

  // Config
  res.locals.SITE = res.app.get('config').SITE;
  res.locals.THEME = res.app.get('config').THEME;

  // Latest posts
  res.locals.latestPosts = await Post.find({ type: 'post', status: 'Published' })
    .select('title slug')
    .sort({ createdAt: -1 })
    .limit(5);

  // Category list
  res.locals.categoryList = await Category.find({})
    .select('name slug')
    .sort({ name: 1 });

  // Page list
  res.locals.pageList = await Post.find({ type: 'page', status: 'Published' })
    .select('title slug')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get first paragraph
  res.locals.firstParagraph = (text) => {
    return text.split('.')[0];
  };

  // Remove HTML
  res.locals.removeHTML = (text) => {
    return text.replace(/(<([^>]+)>)/ig, '');
  };

  next();
});

// Home
Router.all('/', require('./home.controller'));

// Post
Router.use('/post', require('./post.controller'));

// Page
Router.use('/page', require('./page.controller'));

// Category
Router.use('/category', require('./category.controller'));

Router.use((req, res, next) => {

  try {
    res.render(res.locals.template);
  } catch (err) {
    next(createError(404));
  }

});

// catch 404 and forward to error handler
Router.use((req, res, next) => {
  next(createError(404));
});

// error handler
Router.use((err, req, res, next) => {

  // Template
  res.locals.template = 'error';

  // Data
  res.locals.data = {
    page: { title: err.message },
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = Router;