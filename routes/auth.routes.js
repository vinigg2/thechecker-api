const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth.controller');

const routes = express.Router();

/**
 * Auth routes
 */
routes.post('/signup', authController.postSignup);
routes.post('/login', authController.postLogin);
routes.get('/logout', authController.logout);
routes.post('/forgot', authController.postForgot);
routes.get('/reset/:token', authController.getReset);
routes.post('/reset/:token', authController.postReset);

/**
 * Facebook routes
 */
routes.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
routes.get('/facebook/callback', passport.authenticate('facebook', {}), (req, res) => {
  res.status(200).send({ message: 'Login Facebook successfull' });
});

/**
 * Google routes
 */
routes.get('/google', passport.authenticate('google', { scope: 'profile email' }));
routes.get('/google/callback', passport.authenticate('google', {}), (req, res) => {
  res.status(200).send({ message: 'Login Google successfull' });
});

module.exports = routes;