const express = require("express");
const router = express.Router(); // 引入 Express 路由器

const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");

const models = require("../models");
const User = models.User;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    (async () => {
      try {
        const user = await User.findOne({
          attributes: ["id", "name", "email", "password"],
          where: { email: username },
          raw: true,
        });
        return user
          ? (await bcrypt.compare(password, user.password))
            ? done(null, user)
            : done(null, false, {
                type: "error", // 此行可省略，因為 type 預設名稱即為 error
                message: "email 或密碼錯誤",
              })
          : done(null, false, { message: "email 或密碼錯誤" });
      } catch (error) {
        error.errorMessage = "登入失敗 :(";
        done(error);
      }
    })();
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      const {value: email} = profile.emails[0];
      const { displayName: name } = profile;
      (async () => {
        try {
          const user = await User.findOne({
            attributes: ["id", "name", "email"],
            where: { email },
            raw: true,
          });
          if (user) {
            done(null, user);
          } else {
            const randomPwd = Math.random().toString(36).slice(-8);
            const { id } = await User.create({
              email,
              name,
              password: await bcrypt.hash(randomPwd, 10),
            });
            return done(null, { id, name, email });
          }
        } catch (error) {
          error.errorMessage = "登入失敗 :(";
          done(error);
        }
      })();
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  return done(null, { id: user.id });
});

const todos = require("./todos"); // 引入 todos 路由模組
const users = require("./users"); // 引入 users 路由模組
const authHandler = require("../middlewares/auth-handler");

router.use("/todos", authHandler, todos); // 設定 todos 路由模組，加入 authHandler 來完成身分驗證
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

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
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
