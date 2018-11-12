const Router = require('express').Router();
const fs = require('fs');

// Settings
Router.get('/', async (req, res, next) => {

  // Current config
  let currentConfig = res.app.get('config').SITE;

  // Theme list
  let themeList = fs.readdirSync('views');

  // Template
  res.locals.template = 'settings.ejs';

  // Data
  res.locals.data = {
    page: { title: 'Settings' },
    config: currentConfig,
    themes: themeList
  };

  next();
});

// Settings
Router.post('/', async (req, res, next) => {

  let message = '';

  // Current config
  let currentConfig = JSON.parse(fs.readFileSync('./config.json'));

  // Theme list
  let themeList = fs.readdirSync('views');

  // Template
  res.locals.template = 'settings.ejs';

  currentConfig.SITE.title = req.body.site_title;
  currentConfig.SITE.url = req.body.site_url;
  currentConfig.SITE.postsPerPage = parseInt(req.body.posts_per_page, 10);
  currentConfig.SITE.disqusKey = req.body.disqus_key;
  currentConfig.SITE.apiStatus = req.body.api_status == 'on' ? true : false;
  currentConfig.SITE.registerStatus = req.body.register_status == 'on' ? true : false;
  currentConfig.SITE.theme = req.body.theme_name;

  try {
    fs.writeFileSync('config.json', JSON.stringify(currentConfig), (err) => {
      if (err) throw err;
    });
    message = 'Settings saved.';
  } catch (err) {
    message = err.message;
  }

  // Data
  res.locals.data = {
    page: { title: 'Settings' },
    config: currentConfig.SITE,
    themes: themeList,
    message: message
  };

  next();
});

module.exports = Router;