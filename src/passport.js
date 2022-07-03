const mongoose = require("mongoose");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJwt = require("passport-jwt");
const JWTstrategy = passportJwt.Strategy;

const models = require("./models");

const env = process.env;
const app = global.app;
const User = models.User;

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new JWTstrategy(
    {
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.PASSPORT_JWT_SECRET || "kommaninjaz3g84",
      passReqToCallback: true,
    },
    (req, payload, done) => {
      console.log("inside jwt shit", payload);
      User.findById(payload.userId, function (err, user) {
        req.isAuthenticated = () => {
          return !!user;
        };

        if (err) {
          return done(err, false);
        }
        if (user) {
          req.user = user;
          req.isAuthenticated = () => {
            return true;
          };
          return done(null, user);
        } else {
          req.isAuthenticated = () => {
            return false;
          };
          return done(null, false);
          // or you could create a new account
        }
      });
    }
  )
);

app.use(passport.initialize());
// app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
