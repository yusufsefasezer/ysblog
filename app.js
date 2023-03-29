const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const User = require('./models/User');

const app = express();
let config = JSON.parse(fs.readFileSync('config.json'));
let themeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'views', config.SITE.theme, 'theme.json')));
config.THEME = themeData;
app.set('config', config);

// Connect to mongodb
mongoose.connect(config.DB_URI);
mongoose.Promise = global.Promise;

// Express setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())

// Passport
app.use(session({
  name: config.SESSION.name,
  secret: config.SESSION.secret,
  //store: new mongoStore({ mongooseConnection: mongoose.connection }),
  store: MongoStore.create({ mongoUrl: config.DB_URI }),
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .catch(err => {
      done(err);
    })
    .then(user => {
      done(null, user);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views', config.SITE.theme));
app.set('view engine', config.THEME.engine);
app.use(express.static(path.join(app.get('views'), 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin', 'views', 'assets')));

// Admin Controller
app.use('/admin', require('./admin/controller'));

// Site Controller
app.use('/', require('./controller'));

module.exports = app;