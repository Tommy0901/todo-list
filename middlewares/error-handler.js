module.exports = (error, req, res, next) => {
  console.error(error);
  !error instanceof Error
    ? req.flash("error", `${error}`)
    : req.flash("error", error.error_msg || "伺服器錯誤 :(");
  res.redirect("back");
  next(error); // 將錯誤傳給 express 預設的 error handler middleware
};
