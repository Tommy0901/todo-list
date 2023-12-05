const express = require("express");
const router = express.Router();

const models = require("../models");
const { Op } = require("sequelize");

const Todo = models.Todo;
const displayNumber = 20;

router.get("/", (req, res, next) => {
  const { id: userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  (async () => {
    try {
      const todos = await Todo.findAll({
        attributes: ["id", "name", "isComplete"],
        where: { userId },
        offset: (page - 1) * displayNumber,
        limit: displayNumber,
        raw: true,
      });
      const totalPage = Math.ceil((await Todo.count()) / displayNumber);
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
  const { id: userId } = req.user;
  const { inputName: name } = req.body;
  (async () => {
    try {
      const totalPage = Math.ceil((await Todo.count()) / displayNumber);
      await Todo.create({ name, userId });
      req.flash("success", "新增成功!");
      res.redirect(`/todos?page=${totalPage}`);
    } catch (error) {
      error.error_msg = "新增失敗 :(";
      next(error);
    }
  })();
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  (async () => {
    try {
      const totalPage = Math.ceil((await Todo.count()) / displayNumber);
      const currentPage = Math.ceil(
        (await Todo.count({ where: { id: { [Op.lte]: id } } })) / displayNumber
      );
      const page = Math.min(currentPage, totalPage);
      const todo = await Todo.findByPk(id, { raw: true });
      if (!todo) {
        req.flash("error", "找不到資料 :(");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      res.render("todo", { todo, page });
    } catch (error) {
      error.error_msg = "資料取得失敗 :(";
      next(error);
    }
  })();
});

router.get("/:id/edit", (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  (async () => {
    try {
      const totalPage = Math.ceil((await Todo.count()) / displayNumber);
      const currentPage = Math.ceil(
        (await Todo.count({ where: { id: { [Op.lte]: id } } })) / displayNumber
      );
      const page = Math.min(currentPage, totalPage);
      const todo = await Todo.findByPk(id, { raw: true });
      if (!todo) {
        req.flash("error", "找不到資料 :(");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      res.render("edit", { todo, page });
    } catch (error) {
      error.error_msg = "資料取得失敗 :(";
      next(error);
    }
  })();
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { editedName: name, tickCheckbox: isComplete } = req.body;
  (async () => {
    try {
      const todo = await Todo.findByPk(id);
      if (!todo) {
        req.flash("error", "找不到資料 :(");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      await todo.update({ name, isComplete: isComplete === "done" });
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
  const { id: userId } = req.user;
  (async () => {
    try {
      const totalPage = Math.ceil((await Todo.count()) / displayNumber);
      const currentPage = Math.ceil(
        (await Todo.count({ where: { id: { [Op.lte]: id } } })) / displayNumber
      );
      const page = Math.min(currentPage, totalPage);
      const todo = await Todo.findByPk(id);
      if (!todo) {
        req.flash("error", "找不到資料 :(");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      await todo.destroy();
      req.flash("success", "刪除成功!");
      res.redirect(`/todos?page=${page}`);
    } catch (error) {
      error.error_msg = "刪除失敗 :(";
      next(error);
    }
  })();
});

module.exports = router;
