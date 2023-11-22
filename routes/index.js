const express = require("express");
const router = express.Router(); // 引入 Express 路由器

const todos = require("./todos"); // 引入 todos 路由模組
const users = require("./users"); // 引入 users 路由模組

router.use("/todos", todos) // 設定 todos 路由模組
router.use("/users", users) // 設定 todos 路由模組

router.get("/", (req, res) => {
  try {
    res.render("index", { error: req.flash("error") });
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

module.exports = router;