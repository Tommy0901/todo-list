const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const router = require("./routes"); // 引用路由器
const passport = require("./config/passport");

const messageHandler = require("./middlewares/message-handler");
const errorHandler = require("./middlewares/error-handler");

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: "false",
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler);
app.use(router); // 將 request 導入路由器
app.use(errorHandler);

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`); // http://127.0.0.1:3000
});
