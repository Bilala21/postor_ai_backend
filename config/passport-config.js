const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const { User } = require("../models");
const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET,
} = require("../utils/constants");

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        const userId = req.user.id;
        let user = await User.findByPk(userId);

        if (user) {
          user.facebook_id = profile.id;
          user.facebook_access_token = accessToken;
          await user.save();

          return done(null, user);
        } else {
          return done(new Error("User not found"), null);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new InstagramStrategy(
    {
      clientID: INSTAGRAM_CLIENT_ID,
      clientSecret: INSTAGRAM_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/instagram/callback",
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        const userId = req.user.id;
        let user = await User.findByPk(userId);

        if (user) {
          user.instagram_id = profile.id;
          user.instagram_access_token = accessToken;
          await user.save();

          return done(null, user);
        } else {
          return done(new Error("User not found"), null);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
