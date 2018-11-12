const Router = require('express').Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

// Home
Router.get('/', async (req, res, next) => {

  // Template
  res.locals.template = 'index.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Dashboard' },
    count: {
      post: await Post.countDocuments({ type: 'post' }),
      page: await Post.countDocuments({ type: 'page' }),
      category: await Category.countDocuments({})
    },
    posts: await Post.find({ type: 'post' })
      .select('title createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
  };

  next();
});

module.exports = Router;