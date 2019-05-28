const express = require('express');

const usersController = require('../controllers/users.controller');

const routes = express.Router();

/**
 * Users routes
 */
routes.post('/me', usersController.getMe);
routes.put('/me', usersController.updateMe);

module.exports = routes;