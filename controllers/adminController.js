const asyncHandler = require("express-async-handler");
const db = require("../db/pool");
const { query } = require("express");

const adminFormGet = (req, res, next) => {
  const path = "/dashboard" + req.path;
  console.log(path);
  res.render("adminCheck", {
    title: "Admin Auth",
    path,
  });
};

const confirmItemDelete = asyncHandler(async (req, res, next) => {
  const itemId = req.body.id;
  let sql;
  if (Array.isArray(itemId)) {
    sql = "DELETE FROM items WHERE id = ANY($1) RETURNING *";
  } else {
    sql = "DELETE FROM items WHERE id = $1 RETURNING *";
  }
  const response = await db.query(sql, [itemId]);
  console.log(response);
  res.redirect("/dashboard");
});

const confirmCategoryDelete = asyncHandler(async (req, res, next) => {
  const categoryId = req.body.id;
  const response = await db.query(
    "DELETE FROM categories WHERE id = $1 RETURNING *;",
    [categoryId],
  );
  console.log(response);
  res.redirect("/dashboard");
});

const adminFormPost = asyncHandler(async (req, res, next) => {});

module.exports = {
  adminFormGet,
  adminFormPost,
  confirmItemDelete,
  confirmCategoryDelete,
};
