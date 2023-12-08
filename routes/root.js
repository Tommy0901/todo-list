const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.error(error);
    res.send("伺服器錯誤 :(");
  }
});

router.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error(error);
    res.redirect("back");
  }
});

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.error(error);
    res.redirect("back");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/logout", (req, res) => {
  req.logout((error) => {
    return error ? next(error) : res.redirect("/login");
  });
});

module.exports = router;
