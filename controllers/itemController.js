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
        path: req.originalUrl,
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

    console.log("here");

    res
      .setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      )
      .render("item", {
        title: "Item info",
        item: item.rows[0],
        categories: (await db.query("SELECT * FROM categories;")).rows,
        admin: true,
      });
  }),
];

const updateItemPost = [
  body("categorySelect")
    .if((value, { req }) => !req.body.categoryInput)
    .isNumeric()
    .withMessage("Invalid category ID")
    .custom(async (value) => {
      const category = await db.query(
        "SELECT * FROM categories WHERE id = $1",
        [value],
      );
      if (category.rows.length === 0) {
        throw new Error("Category does not exist");
      }
      return true;
    }),
  body("categoryInput")
    .if((value, { req }) => !req.body.categorySelect)
    .trim()
    .isAlpha()
    .withMessage("Category must be alphabetical characters")
    .isLength({ min: 1, max: 30 })
    .withMessage("Category between 1-30 characters")
    .escape(),
  body("itemName")
    .notEmpty()
    .withMessage("Name required")
    .trim()
    .isAlpha()
    .withMessage("Name must consist of alphabetical characters")
    .isLength({ min: 1, max: 45 })
    .withMessage("Name between 1-45 characters")
    .escape(),
  body("price")
    .trim()
    .isDecimal()
    .withMessage("Price must be decimal e.g. 5.00")
    .escape(),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity cannot be empty")
    .trim()
    .isNumeric()
    .withMessage("Quantity must be numeric")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const { categorySelect, categoryInput, itemName, price, quantity } =
      req.body;
    let response;
    let category;
    if (categoryInput) {
      response = await db.query(
        "INSERT INTO categories(cat_name) VALUES ($1) RETURNING *;",
        [categoryInput],
      );
    } else {
      response = await db.query(
        `UPDATE items
         SET category_id = $1, item_name = $2, quantity = $3, price = $4 
         WHERE id = $5
         RETURNING *;`,
        [categorySelect, itemName, quantity, price, req.params.id],
      );
    }
    category = response.rows[0];
    console.log(category);
    res.redirect(`/dashboard/items/${req.params.id}`)
    

    const err = validationResult(req);
    if (!err.isEmpty()) {
    }
  }),
];

module.exports = {
  allItemsGet,
  singleItemGet,
  createItemGet,
  updateItemGet,
  createItemPost,
  updateItemForm,
  updateItemPost,
};
