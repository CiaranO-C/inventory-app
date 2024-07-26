const asyncHandler = require("express-async-handler");
const db = require("../db/pool");
const { body, validationResult } = require("express-validator");

function allItemsGet(req, res, next) {
  res.render("items");
}

const singleItemGet = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const item = await db.query(
    `
        SELECT items.id, item_name, quantity, price, cat_name
        FROM items
        JOIN categories
        ON items.category_id = categories.id
        WHERE items.id = $1;`,
    [id],
  );
  res.render("item", {
    title: "Item info",
    item: item.rows[0],
  });
});

function createItemGet(req, res, next) {
  res.send("create new item!");
}

function updateItemGet(req, res, next) {
  res.send("update existing item GET");
}

function createItemPost(req, res, next) {
  res.send("created new item, display it");
}

const updateItemForm = [
  body("password").custom((value) => {
    if (value !== process.env.ADMIN_PASSWORD) {
      throw new Error("Incorrect password");
    }
  }),
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const password = req.body.password;
    const err = validationResult(req);
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.render("adminCheck", {
        title: "Admin Auth",
        itemId: id,
        errors: err.array(),
      });
    }

    const item = await db.query(
      `
            SELECT items.id, item_name, quantity, price, cat_name
            FROM items
            JOIN categories
            ON items.category_id = categories.id
            WHERE items.id = $1;`,
      [id],
    );

    res
      .setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      )
      .render("item", {
        title: "Item info",
        item: item.rows[0],
        admin: true,
      });
  }),
];

const updateItemPost = asyncHandler(async (req, res, next) => {});

module.exports = {
  allItemsGet,
  singleItemGet,
  createItemGet,
  updateItemGet,
  createItemPost,
  updateItemForm,
  updateItemPost,
};
