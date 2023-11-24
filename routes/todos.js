const express = require("express");
const router = express.Router();

const models = require("../models");
const Todo = models.Todo;
const displayNumber = 20;

router.get("/", (req, res, next) => {
  (async () => {
    const page = parseInt(req.query.page) || 1;
    try {
      const todos = await Todo.findAll({
        attributes: ["id", "name", "isComplete"],
        offset: (page - 1) * displayNumber,
        limit: displayNumber,
        raw: true,
      });
      const { count } = await Todo.findAndCountAll();
      const totalPage = Math.ceil(count / displayNumber);
      res.render("todos", {
        todos,
        prev: page - 1 ? page - 1 : page,
        next: page < totalPage ? page + 1 : page,
        page,
        totalPage,
      });
    } catch (error) {
      error.error_msg = "資料取得失敗 :(";
      next(error);
    }
  })();
});

router.get("/new", (req, res) => {
  res.render("new");
});

router.post("/", (req, res, next) => {
  const { inputName: name } = req.body;
  (async () => {
    try {
      await Todo.create({ name });
      req.flash("success", "新增成功!");
      res.redirect("todos");
    } catch (error) {
      error.error_msg = "新增失敗 :(";
      next(error);
    }
  })();
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const page = Math.floor(id / displayNumber) + 1;
  (async () => {
    try {
      const todo = await Todo.findByPk(id, { raw: true });
      res.render("todo", { todo, page });
    } catch (error) {
      error.error_msg = "資料取得失敗 :(";
      next(error);
    }
  })();
});

router.get("/:id/edit", (req, res, next) => {
  const { id } = req.params;
  const page = Math.floor(id / displayNumber) + 1;
  (async () => {
    try {
      const todo = await Todo.findByPk(id, { raw: true });
      res.render("edit", { todo, page });
    } catch (error) {
      error.error_msg = "資料取得失敗 :(";
      next(error);
    }
  })();
});

router.put("/:id", (req, res, next) => {
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
      error.error_msg = "更新失敗 :(";
      next(error);
    }
  })();
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  (async () => {
    try {
      await Todo.destroy({ where: { id } });
      req.flash("success", "刪除成功!");
      res.redirect("/todos");
    } catch (error) {
      error.error_msg = "刪除失敗 :(";
      next(error);
    }
  })();
});

module.exports = router;
