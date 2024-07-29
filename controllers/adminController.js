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

const passwordReceiver = (req, res, next) => {
  const password = req.body.password;
  const path = req.path;
};

const confirmDelete = asyncHandler(async (req, res, next) => {
  const itemId = req.body.itemName;
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

const adminFormPost = asyncHandler(async (req, res, next) => {});

module.exports = { adminFormGet, adminFormPost, confirmDelete };
