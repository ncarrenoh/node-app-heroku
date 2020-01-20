const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    // scope: 'profile',
    callbackURL: 'http://localhost:5000/auth/google/callback',
    // passReqToCallback: true,
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
      .then(existingUser => {
        if (existingUser) {
          // existe usuario
          done(null, existingUser);
        } else {
          new User({ googleId: profile.id }).save(error => {
            if (error) {
              console.log('error', error);
            } else {
              console.log('data save succefull');
            }
          });
        }
      });
  }),
);
