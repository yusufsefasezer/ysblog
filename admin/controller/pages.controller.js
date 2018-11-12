const Router = require('express').Router();
const Post = require('../../models/Post');

// Pages
Router.get('/', async (req, res, next) => {

  // Template
  res.locals.template = 'page.list.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Pages' },
    posts: await Post.find({ type: 'page' })
      .select('title status createdAt')
      .sort({ createdAt: -1 })
  };

  next();
});

// Page - New
Router.get('/new', async (req, res, next) => {

  // Template
  res.locals.template = 'page.editor.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Add New Page' }
  };

  next();
});

// Page - New
Router.post('/new', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'page.editor.ejs';

  try {
    const newPage = new Post({
      title: req.body.post_title,
      slug: Post.slugify(req.body.post_title),
      content: req.body.post_content,
      status: req.body.post_status,
      author: req.session.passport.user,
      type: 'page'
    });
    await newPage.save();
    message = 'Record added successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Add New Page' },
    message: message
  };

  next();
});

// Page - Delete
Router.get('/delete/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'page.list.ejs';

  try {
    await Post.findOneAndDelete({ _id: req.params.id, author: req.session.passport.user });
    message = 'Record deleted successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Posts' },
    posts: await Post.find({ type: 'page' })
      .select('title status createdAt')
      .sort({ createdAt: -1 }),
    message: message
  };

  next();
});

// Page - Edit
Router.get('/edit/:id', async (req, res, next) => {

  // Template
  res.locals.template = 'page.editor.ejs';

  try {
    // Data
    res.locals.data = {
      page: { title: 'Edit Page' },
      post: await Post.findOne({ _id: req.params.id, type: 'page' })
    };
    if (res.locals.data.post == null) throw 'Page doesnt exists.';
  } catch (err) {
    return res.redirect('/admin');
  }

  next();
});

// Page - Edit
Router.post('/edit/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'page.editor.ejs';

  try {
    await Post.findOneAndUpdate({ _id: req.params.id }, {
      title: req.body.post_title,
      content: req.body.post_content,
      status: req.body.post_status
    });
    message = 'Record updated successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Edit Post' },
    post: await Post.findOne({ _id: req.params.id, type: 'page' }),
    message: message
  };

  next();
});

module.exports = Router;