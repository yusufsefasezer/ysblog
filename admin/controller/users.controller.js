const Router = require('express').Router();
const User = require('../../models/User');
const Post = require('../../models/Post');

// Users
Router.get('/', async (req, res, next) => {

  // Template
  res.locals.template = 'user.list.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Users' },
    users: await User.find({})
  };

  next();
});

// User - New
Router.post('/', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'user.list.ejs';

  try {
    const newUser = new User({
      email: req.body.email,
      password: User.md5(req.body.password),
      fname: req.body.fname,
    });

    await newUser.save();
    message = 'User added successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Users' },
    users: await User.find({}),
    message: message
  };

  next();
});

// User - Delete
Router.get('/delete/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'user.list.ejs';

  try {
    if (await User.countDocuments({}) == 1) throw new Error('Cannot Be Deleted');

    await User.findOneAndDelete({ _id: req.params.id });
    await Post.deleteMany({ author: req.params.id });
    message = 'User deleted successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Users' },
    users: await User.find({}),
    message: message
  };

  next();
});

// User - Edit
Router.get('/edit/:id', async (req, res, next) => {

  // Template
  res.locals.template = 'user.list.ejs';

  try {

    // Data
    res.locals.data = {
      page: { title: 'Edit User' },
      user: await User.findOne({ _id: req.params.id }),
      users: await User.find({}),
    };

  } catch (err) {
    return res.redirect('/admin');
  }

  next();
});

// User - Edit
Router.post('/edit/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'user.list.ejs';

  try {
    await User.findOneAndUpdate({ _id: req.params.id }, {
      password: User.md5(req.body.password),
      fname: req.body.fname,
    });
    message = 'User updated successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Edit User' },
    user: await User.findOne({ _id: req.params.id }),
    users: await User.find({}),
    message: message
  };

  next();
});

module.exports = Router;