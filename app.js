const express = require("express");
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

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll({
      raw: true,
      attributes: ["id", "name", "isComplete"],
    });
    res.render("todos", { todos });
  } catch {
    res.status(422).json(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.send({ users });
  } catch {
    res.status(422).json(err);
  }
});

app.get("/todos/new", (req, res) => {
  res.render("new");
});

app.post("/todos", async (req, res) => {
  try {
    const { inputName: name } = req.body;
    await Todo.create({ name });
    res.redirect("todos");
  } catch {
    res.status(422).json(err);
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id, { raw: true });
    res.render("todo", { todo });
  } catch {
    res.status(422).json(err);
  }
});

app.get("/todos/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id, { raw: true });
    res.render("edit", { todo });
  } catch {
    res.status(422).json(err);
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { editedName: name, tickCheckbox: isComplete } = req.body;
    await Todo.update({ name, isComplete: isComplete === 'done' }, { where: { id } });
    res.redirect(`/todos/${id}`);
  } catch {
    res.status(422).json(err);
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.destroy({ where: { id } });
    res.redirect("/todos");
  } catch {
    res.status(422).json(err);
  }
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`); // http://127.0.0.1:3000
});
