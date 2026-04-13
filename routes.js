const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('./src/controllers/homeController.js');
const taskController = require('./src/controllers/taskController.js');
const loginController = require('./src/controllers/loginController.js');

// Middlewares

// Routes

    // Home
router.get('/', homeController.index);

    // Login
router.get('/login/index', loginController.index);
router.post('/login/login', loginController.login);
router.post('/login/register', loginController.register);
router.post('/logout', loginController.logout);

    // Tasks
router.get('/tasks/index', taskController.index);
router.post('/tasks/create', taskController.create);
router.post('/tasks/update', taskController.update);
router.post('/tasks/delete', taskController.delete);

module.exports = router;