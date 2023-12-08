const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
