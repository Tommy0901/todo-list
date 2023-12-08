const express = require("express");
const router = express.Router(); // 引入 Express 路由器

const root = require("./root");
const oauth2 = require("./oauth2");
const todos = require("./todos"); // 引入 todos 路由模組
const users = require("./users"); // 引入 users 路由模組
const authHandler = require("../middlewares/auth-handler");

router.use("/", root);
router.use("/oauth2", oauth2);
router.use("/todos", authHandler, todos); // 設定 todos 路由模組，加入 authHandler 來完成身分驗證
router.use("/users", users); // 設定 todos 路由模組

module.exports = router;
