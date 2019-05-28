const express = require('express');

const routes = express.Router();

/**
 * List of main routes
 */
routes.use('/auth', require('./auth.routes.js'))
routes.use('/users', require('./users.routes.js'))

module.exports = routes;