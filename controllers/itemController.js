const asyncHandler = require("express-async-handler");
const db = require("../db/pool");
const psql = require("../db/queries");
const { body, validationResult } = require("express-validator");

const orderValidate = body("order")
  .custom((value) => {
    if (value !== "ASC" || value !== "DESC") {
      throw new Error("invalid display order");
    }

    return true;
  })
  .optional({ values: "falsy" });

const handleSort = asyncHandler(async (req, res, next) => {
  const path = new URL(req.get("referer")).pathname;
  console.log(path);
  const { sort, order } = req.body;
  const conditions = {
    "/dashboard/items/in-stock": "quantity > 0",
    "/dashboard/items/low-stock": "quantity <= 10 AND quantity > 0",
    "/dashboard/items/out-of-stock": "quantity = 0",
  };
  console.log("sort:", sort, " | ", "order:", order, " | ", conditions[path]);
  const items = await psql.getSortedItems(sort, order, conditions[path]);
  if (!items) {
    return res.redirect(path);
  }
  req.body.items = items;

  next();
});

const inStockGet = asyncHandler(async (req, res, next) => {
  if (!req.body.items) {
    const items = await psql.getInStockItems();
    res.render("items", {
      title: "In Stock",
      items,
      path: req.originalUrl,
    });
  } else {
    res.render("items", {
      title: "In Stock",
      items: req.body.items,
      path: req.originalUrl,
      sort: req.body.sort,
      order: req.body.order,
    });
  }
});

const lowStockGet = asyncHandler(async (req, res, next) => {
  if (!req.body.items) {
    const items = await psql.getLowStockItems();
    res.render("items", {
      title: "Low Stock",
      items,
      path: req.originalUrl,
    });
  } else {
    res.render("items", {
      title: "Low Stock",
      items: req.body.items,
      path: req.originalUrl,
      sort: req.body.sort,
      order: req.body.order,
    });
  }
});

const outOfStockGet = asyncHandler(async (req, res, next) => {
  if (!req.body.items) {
    const items = await psql.getOutOfStockItems();
    res.render("items", {
      title: "Out of Stock",
      items,
      path: req.originalUrl,
    });
  } else {
    res.render("items", {
      title: "Out of Stock",
      items: req.body.items,
      path: req.originalUrl,
      sort: req.body.sort,
      order: req.body.order,
    });
  }
});

const singleItemGet = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const item = await db.query(
    `
        SELECT items.id, item_name, quantity, price, cat_name, categories.id AS cat_id
        FROM items
        JOIN categories
        ON items.category_id = categories.id
        WHERE items.id = $1;`,
    [id],
  );
  console.log(item.rows);
  res.render("item", {
    title: "Item info",
    item: item.rows[0],
  });
});

const createItemGet = asyncHandler(async (req, res, next) => {
  res
    .setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    )
    .render("item", {
      title: "Item info",
      categories: (await db.query("SELECT * FROM categories;")).rows,
      admin: true,
    });
});

function updateItemGet(req, res, next) {
  res.send("update existing item GET");
}

const createItemPost = asyncHandler(async (req, res, next) => {
  const { categorySelect, categoryInput, itemName, price, quantity } = req.body;

  if (categoryInput) {
    const newCategory = await db.query(
      "INSERT INTO categories(cat_name) VALUES($1) RETURNING id;",
      [categoryInput],
    );
    console.log(newCategory.rows);
  }

  const newItem = await db.query(
    `INSERT INTO items(category_id, item_name, quantity, price) VALUES($1, $2, $3, $4) RETURNING *;`,
    [categorySelect, itemName, quantity, price],
  );

  console.log(newItem);

  res.redirect(`/dashboard/items/${newItem.rows[0].id}`);
});

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
    res.redirect(`/dashboard/items/${req.params.id}`);

    const err = validationResult(req);
    if (!err.isEmpty()) {
    }
  }),
];

const deleteOnePost = asyncHandler(async (req, res, next) => {
  const itemId = req.body.toDelete;
  const item = (
    await db.query(`SELECT *, item_name AS _name FROM items WHERE id = $1`, [
      itemId,
    ])
  ).rows;
  console.log(`Are you sure you want to delete the following items?`);
  console.log(item);

  res.render("confirmDelete", {
    title: "Confirm item delete",
    toDelete: item,
    returnPath: `/dashboard/items/${item[0].id}`,
  });
});

module.exports = {
  handleSort,
  inStockGet,
  lowStockGet,
  outOfStockGet,
  singleItemGet,
  createItemGet,
  updateItemGet,
  createItemPost,
  updateItemForm,
  updateItemPost,
  deleteOnePost,
};
