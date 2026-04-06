require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

// For DNS resolution, to avoid potential issues with the default DNS servers when connecting to MongoDB
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log('Database connected');
  app.emit('ready');
}).catch((err) => {
  console.error('Database connection error:', err);
});

// Setup for sessions and flash messages
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');

// Middleware Setup (helmet is commented out for now, but can be enabled for security hardening)
//const helmet = require('helmet');
//app.use(helmet());
const csrf = require('csurf');
const { globalMiddleware, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middlewares.js');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Session configuration
const sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTION_STRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24* 7, // 7 days
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Middleware use
app.use(csrf());
app.use(globalMiddleware);
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use(routes);

app.on('ready', () => {
  console.log('Database is ready, starting server...');

  app.listen(port, () => {
    console.log(`Server running in http://localhost:${port}`);
  });
});