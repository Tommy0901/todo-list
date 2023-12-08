const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");

const User = require("../models").User;

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

module.exports = passport