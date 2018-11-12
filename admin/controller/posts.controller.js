const Router = require('express').Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

// Posts
Router.get('/', async (req, res, next) => {

  // Template
  res.locals.template = 'post.list.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Posts' },
    posts: await Post.find({ type: 'post' })
      .select('title category status createdAt')
      .sort({ createdAt: -1 })
      .populate('category')
  };

  next();
});

// Post - New
Router.get('/new', async (req, res, next) => {

  // Template
  res.locals.template = 'post.editor.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Add New Post' },
    category: await Category.find({})
  };

  next();
});

// Post - New
Router.post('/new', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'post.editor.ejs';

  try {
    const newPost = new Post({
      title: req.body.post_title,
      slug: Post.slugify(req.body.post_title),
      content: req.body.post_content,
      status: req.body.post_status,
      category: req.body.post_category,
      author: req.session.passport.user,
      type: 'post'
    });
    await newPost.save();
    message = 'Record added successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Add New Post' },
    category: await Category.find({}),
    message: message
  };

  next();
});

// Post - Delete
Router.get('/delete/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'post.list.ejs';

  try {
    await Post.findOneAndDelete({ _id: req.params.id, author: req.session.passport.user });
    message = 'Record deleted successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Posts' },
    posts: await Post.find({ type: 'post' })
      .select('title category status createdAt')
      .sort({ createdAt: -1 })
      .populate('category'),
    message: message
  };

  next();
});

// Post - Edit
Router.get('/edit/:id', async (req, res, next) => {

  // Template
  res.locals.template = 'post.editor.ejs';

  try {
    // Data
    res.locals.data = {
      page: { title: 'Edit Post' },
      category: await Category.find({}),
      post: await Post.findOne({ _id: req.params.id })
    };    

  } catch (err) {
    return res.redirect('/admin');
  }

  next();
});

// Post - Edit
Router.post('/edit/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'post.editor.ejs';

  try {
    await Post.findOneAndUpdate({ _id: req.params.id }, {
      title: req.body.post_title,
      content: req.body.post_content,
      status: req.body.post_status,
      category: req.body.post_category
    });
    message = 'Record updated successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Edit Post' },
    post: await Post.findOne({ _id: req.params.id }),
    category: await Category.find({}),
    message: message
  };

  next();
});

module.exports = Router;