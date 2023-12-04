const express = require("express");
const router = express.Router(); // 引入 Express 路由器

const passport = require("passport");
const LocalStrategy = require("passport-local");

const models = require("../models");
const User = models.User;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    (async () => {
      try {
        const user = await User.findOne({
          attributes: ["id", "name", "email", "password"],
          where: { email: username },
          raw: true,
        });
        return !user || user.password !== password
          ? done(null, false, {
              type: "error", // 此行可省略，因為 type 預設名稱即為 error
              message: "email 或密碼錯誤",
            })
          : done(null, user);
      } catch (error) {
        error.errorMessage = "登入失敗 :(";
        done(error);
      }
    })();
  })
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

const todos = require("./todos"); // 引入 todos 路由模組
const users = require("./users"); // 引入 users 路由模組

router.use("/todos", todos); // 設定 todos 路由模組
router.use("/users", users); // 設定 todos 路由模組

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
  res.redirect("login");
});

module.exports = router;
