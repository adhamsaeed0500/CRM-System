const passport  = require('passport');
const GoogelStrategy = require('passport-google-oauth2');
const User  = require('../models/user.model');

passport.use(new GoogelStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/google/callback' 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findById(profile.id).select('role name');

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        const userData = {
            id: user._id,
            name: user.name || profile.displayName,
            role: user.role
        };

        return done(null, userData);
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
