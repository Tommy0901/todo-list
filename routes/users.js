const express = require("express");
const router = express.Router();

const models = require("../models");
const User = models.User;

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
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) throw new Error("Passwords do not match!");
  return res.send(req.body);
});

module.exports = router;
