const express = require("express");
const router = express.Router();

const models = require("../models");
const Todo = models.Todo;

router.get("/", (req, res) => {
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

router.get("/new", (req, res) => {
  try {
    res.render("new", { error: req.flash("error") });
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    res.redirect("back");
  }
});

router.post("/", (req, res) => {
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

router.get("/:id", (req, res) => {
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

router.get("/:id/edit", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

module.exports = router;
