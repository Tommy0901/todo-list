const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../models").User;

router.get("/", (req, res, next) => {
  (async () => {
    try {
      const users = await User.findAll();
      res.send({ users });
    } catch (error) {
      error.error_msg = "資料取得失敗 :(";
      next(error);
    }
  })();
});

router.post("/", (req, res) => {
  const { email, name, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    req.flash("error", "name, email 及 password 為必填");
    return res.redirect("back");
  }

  if (password !== confirmPassword) {
    req.flash("error", "驗證密碼與密碼不符 :(");
    return res.redirect("back");
  }

  (async () => {
    try {
      const rowCount = await User.count({ where: { email } });
      if (rowCount > 0) {
        req.flash("error", "email 已註冊 :(");
        return res.redirect("back");
      }
      await User.create({
        email,
        name,
        password: await bcrypt.hash(password, 10),
      });
      req.flash("success", "註冊成功!");
      return res.redirect("/login");
    } catch (error) {
      error.error_msg = "註冊失敗 :(";
      next(error);
    }
  })();
});

module.exports = router;
