const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

const models = require("./models");
const Todo = models.Todo;
const User = models.User;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "ThisIsSecret",
    resave: "false",
    saveUninitialized: false,
  })
);
app.use(flash());

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  try {
    res.render("index", { error: req.flash("error") });
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

app.get("/todos", (req, res) => {
  try {
    (async () => {
      try {
        const todos = await Todo.findAll({
          raw: true,
          attributes: ["id", "name", "isComplete"],
        });
        res.render("todos", {
          todos,
          message: req.flash("success"),
          error: req.flash("error"),
        });
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

app.get("/users", (req, res) => {
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

app.get("/todos/new", (req, res) => {
  try {
    res.render("new", { error: req.flash("error") });
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

app.post("/todos", (req, res) => {
  try {
    const { inputName: name } = req.body;
    (async () => {
      try {
        await Todo.create({ name });
        req.flash("success", "新增成功!");
        res.redirect("todos");
      } catch (error) {
        console.error(error);
        req.flash("error", "新增失敗 :(");
        res.redirect("back");
      }
    })();
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

app.get("/todos/:id", (req, res) => {
  try {
    const { id } = req.params;
    (async () => {
      try {
        const todo = await Todo.findByPk(id, { raw: true });
        res.render("todo", {
          todo,
          message: req.flash("success"),
          error: req.flash("error"),
        });
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

app.get("/todos/:id/edit", (req, res) => {
  try {
    const { id } = req.params;
    (async () => {
      try {
        const todo = await Todo.findByPk(id, { raw: true });
        res.render("edit", { todo, error: req.flash("error") });
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

app.put("/todos/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { editedName: name, tickCheckbox: isComplete } = req.body;
    (async () => {
      try {
        await Todo.update(
          { name, isComplete: isComplete === "done" },
          { where: { id } }
        );
        req.flash("success", "更新成功!");
        res.redirect(`/todos/${id}`);
      } catch (error) {
        console.error(error);
        req.flash("error", "更新失敗 :(");
        res.redirect("back");
      }
    })();
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

app.delete("/todos/:id", (req, res) => {
  try {
    const { id } = req.params;
    (async () => {
      try {
        await Todo.destroy({ where: { id } });
        req.flash("success", "刪除成功");
        res.redirect("/todos");
      } catch (error) {
        console.error(error);
        req.flash("error", "刪除失敗!");
        res.redirect("back");
      }
    })();
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`); // http://127.0.0.1:3000
});
