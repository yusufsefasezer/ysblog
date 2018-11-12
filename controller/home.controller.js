const Router = require('express').Router();
const Post = require('../models/Post');

// Home
Router.get('/', async (req, res, next) => {

  let currentPage = parseInt(req.query.page, 10);
  currentPage = isNaN(currentPage) ? 1 : currentPage;
  currentPage--;
  let postCount = await Post.countDocuments({ type: 'post', status: 'Published' });
  let postPerPage = res.locals.SITE.postsPerPage;
  let totalPage = Math.ceil(postCount / postPerPage);
  if (currentPage >= totalPage || currentPage < 0) return next();

  // Template
  res.locals.template = 'index';

  let posts = await Post.find({ type: 'post', status: 'Published' })
    .populate('category')
    .sort({ createdAt: -1 })
    .limit(postPerPage)
    .skip(currentPage * postPerPage);

  // Data
  res.locals.data = {
    page: { title: 'Homepage | ' + res.locals.SITE.title },
    posts: posts,
    pagination: {
      total: totalPage,
      current: currentPage
    }
  };

  next();
});

module.exports = Router;