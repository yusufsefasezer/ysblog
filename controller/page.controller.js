const Router = require('express').Router();
const Post = require('../models/Post');

// Post
Router.get('/:slug', async (req, res, next) => {

  let slug = req.params.slug;

  let post = await Post.findOne({ type: 'page', status: 'Published', slug: slug })
    .populate('category');

  if (post == null) return next();

  // Template
  res.locals.template = 'page';

  // Data
  res.locals.data = {
    page: { title: post.title + ' | ' + res.locals.SITE.title },
    post: post
  };

  next();
});

module.exports = Router;