const express = require("express");
const router = express.Router(); // 引入 Express 路由器

const todos = require("./todos"); // 引入 todos 路由模組
const users = require("./users"); // 引入 users 路由模組

router.use("/todos", todos) // 設定 todos 路由模組
router.use("/users", users) // 設定 todos 路由模組

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

router.post('/login', (req, res) => {
	return res.send(req.body)
})

router.post('/logout', (req, res) => {
	return res.send('logout')
})

module.exports = router;