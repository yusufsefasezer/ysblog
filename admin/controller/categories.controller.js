const Router = require('express').Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

// Categories
Router.get('/', async (req, res, next) => {

  // Template
  res.locals.template = 'category.list.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Categories' },
    categories: await Category.find({})
  };

  next();
});

// Category - New
Router.post('/', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'category.list.ejs';

  try {
    const newCategory = new Category({
      name: req.body.category,
      slug: Category.slugify(req.body.slug),
      parent: req.body.parent
    });

    if (req.body.parent == 0) newCategory.parent = null

    await newCategory.save();
    message = 'Category added successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Categories' },
    categories: await Category.find({}),
    message: message
  };

  next();
});

// Category - Delete
Router.get('/delete/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'category.list.ejs';

  try {
    await Category.findOneAndDelete({ _id: req.params.id });
    await Post.deleteMany({ category: req.params.id });
    message = 'Category deleted successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Categories' },
    categories: await Category.find({}),
    message: message
  };

  next();
});

// Category - Edit
Router.get('/edit/:id', async (req, res, next) => {

  // Template
  res.locals.template = 'category.list.ejs';

  try {

    // Data
    res.locals.data = {
      page: { title: 'Edit Category' },
      category: await Category.findOne({ _id: req.params.id }),
      categories: await Category.find({})
    };

  } catch (err) {
    return res.redirect('/admin');
  }

  next();
});

// Category - Edit
Router.post('/edit/:id', async (req, res, next) => {

  let message = '';

  // Template
  res.locals.template = 'category.list.ejs';

  try {

    await Category.findOneAndUpdate({ _id: req.params.id }, {
      name: req.body.category,
      slug: Category.slugify(req.body.slug),
      parent: req.body.parent
    });

    message = 'Category updated successfully.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Edit Category' },
    category: await Category.findOne({ _id: req.params.id }),
    categories: await Category.find({}),
    message: message
  };

  next();
});

module.exports = Router;