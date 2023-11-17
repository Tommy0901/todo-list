const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

const models = require("./models")
const Todo = models.Todo
const User = models.User

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.send({ todos });
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
  res.send("create todo");
});

app.post("/todos", (req, res) => {
  res.send("add todo");
});

app.get("/todos/:id", (req, res) => {
  res.send(`get todo id: ${req.params.id}`);
});

app.get("/todos/:id/edit", (req, res) => {
  res.send(`get todo edit id: ${req.params.id}`);
});

app.put("/todos/:id", (req, res) => {
  res.send(`todo id: ${req.params.id} has been modified`);
});

app.delete("/todos/:id", (req, res) => {
  res.send(`todo id: ${req.params.id} has been deleted`);
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`); // http://127.0.0.1:3000
});
