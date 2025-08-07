const express = require("express");
const passport = require('passport');
const { authorize } = require('../middlewares/authorization');
const {
  resgiterUser,
  createUserByAdmin,
  loginUser,
  refreshTokenUser,
  logoutUser,
  googleCallback
} = require("../controllers/identity.controller");

const router = express.Router();

router.post("/register", resgiterUser);
router.post("/createUser", authorize(['admin']), createUserByAdmin);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenUser);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  googleCallback
);
router.post("/logout", logoutUser);

module.exports = router;