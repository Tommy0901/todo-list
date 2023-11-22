const express = require("express");
const router = express.Router();

const models = require("../models");
const User = models.User;

router.get("/", (req, res) => {
  try {
    (async () => {
      try {
        const users = await User.findAll();
        res.send({ users });
      } catch (error) {
        console.error(error);
        req.flash("error", "資料取得失敗 :(");
        res.redirect("back");
      }
    })();
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

module.exports = router;
