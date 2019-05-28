const { promisify } = require('util');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');

const UserModel = require('../models/user.model');

const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * POST /login
 * Log in using email and password.
 */
exports.postLogin = function (req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  passport.authenticate('local', (err, user, infos) => {
    if (err) { return res.status(500).send(err) }
    if (!user) { return res.status(404).send(infos); }
    req.login(user, (err) => {
      if (err) { return res.status(500).send(err); }
      return res.status(200).send({
        status: 200,
        user: user
      });
    })
  })(req, res);
};


/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.status(200).send()
  });
};


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = async (req, res) => {
  const { email, name, password } = req.body;

  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 6 characters long').len(6);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  const hashCost = 10;

  bcrypt.hash(password, hashCost)
    .then(passwordHash => {
      const userDocument = new UserModel({ email, profile: { name }, password: passwordHash });
      return userDocument.save();
    })
    .then((user) => res.status(200).send({ message: 'Login successfull', user: user }))
    .catch(() => {
      res.status(400).send({
        error: 'Data required: email, name and password',
      });
    })
};


/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res) => {
  UserModel
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        return res.status(404).send({ error: 'Password reset token is invalid or has expired.' })
      }
      res.status(200).send({ message: 'token is valid' })
    });
};


/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res) => {
  req.assert('password', 'Password must be at least 6 characters long.').len(6);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors)
  }

  const resetPassword = () =>
    UserModel
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then(user => {
        if (!user) {
          return res.status(404).send({ error: 'Password reset token is invalid or has expired.' })
        }
        const hashCost = 10;

        return bcrypt.hash(req.body.password, hashCost)
          .then(passwordHash => {
            user.password = passwordHash;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            return user.save().then(() => new Promise((resolve, reject) => {
              req.logIn(user, (err) => {
                if (err) { return reject(err); }
                resolve(user);
              });
            }));
          })
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return res.status(400).send({ error: 'Password reset token is invalid or has expired.' }) }
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'apinode@starter.com',
      subject: 'Your password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .catch(err => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)

        }
        return Promise.reject(err);
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => res.status(200).send({ message: 'Success! Your password has been changed' }))
    .catch(err => console.log(err))
};


/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors)
  }

  const createRandomToken = randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    UserModel
      .findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return res.status(400).send({ error: 'User not found with this email.' }) }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password',
      text: `You are receiving this email because you have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.FRONTEND_URL}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .catch(err => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
        }
        return Promise.reject(err);
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.status(200).send({ message: `An e-mail has been sent with further instructions.` }))
    .catch(err => console.log(err));
};
