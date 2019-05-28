
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const UserModel = require('../models/user.model');

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  UserModel.findOne({ email: email }, function (err, user) {
  if (err) { return done(err); }
  if (!user) {
    return done(null, false, { error: 'Invalid credentials.' });
  }
  bcrypt.compare(password, user.password)
    .then(passwordsMatch => {
      if (passwordsMatch) {
        return done(null, user);
      } else {
        return done(null, false, { error: 'Invalid credentials.' });
      }
    });  
  });
}));

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.FRONTEND_URL}/auth/facebook/callback`,
  profileFields: ['name', 'email', 'link'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    done('User already connected');
  } else {
    UserModel.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      UserModel.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          done('There is already an account using this email address.');
        } else {
          const user = new UserModel();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));


/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.FRONTEND_URL}/auth/google/callback`,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    done('User already connected');
  } else {
    UserModel.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      UserModel.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          done('There is already an account using this email address.');
        } else {
          const user = new UserModel();
          user.email = profile.emails[0].value;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.name = profile.displayName;
          user.profile.picture = profile._json.image.url;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));