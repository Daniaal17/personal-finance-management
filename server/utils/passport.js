const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BACKEND_URL } = require("../config");

exports.passport = passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: BACKEND_URL + "/app/api/auth/google/callback",
			passReqToCallback: false,
		},
		function (accessToken, refreshToken, profile, done) {
			// console.log("Google Profile", profile, accessToken, refreshToken);
			return done(null, { refreshToken, ...profile });
		}
	)
);
