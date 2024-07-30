const db = require("../db/pool");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const singleCategoryGet = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await db.query(
    `
    SELECT categories.id AS cat_id, cat_name, items.id AS item_id, item_name, quantity, price
    FROM categories
    LEFT JOIN items
    ON categories.id = items.category_id
    WHERE categories.id = $1;
    `,
    [id],
  );

  const cat = category.rows[0].cat_name;
  const categoryTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
  console.log(category.rows);
  res.render("category", {
    title: categoryTitle,
    items: category.rows,
    categoryId: category.rows[0].cat_id,
  });
});

const createCategoryGet = asyncHandler(async (req, res, next) => {
  res.render("dashboard", {
    modal: true,
    categories: (await db.query("SELECT * FROM categories")).rows,
  });
});

const confirmCreatePost = [
  body("password").custom((value, { req }) => {
    console.log(value);
    if (value !== process.env.ADMIN_PASSWORD) {
      throw new Error("Incorrect password");
    }

    return true;
  }),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.render("adminCheck", {
        title: "Admin Auth",
        path: req.originalUrl,
        errors: err.array(),
      });
    }
    const categories = await db.query("SELECT * FROM categories;");

    return res.render("dashboard", {
      title: "Dashboard",
      categories: categories.rows,
      modal: true,
    });
  }),
];

const createCategoryPost = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .isLength({ min: 1, max: 20 })
    .withMessage("Category name must be between 1 and 20 characters")
    .escape()
    .custom(async (value) => {
      //check if name exists in DB
      const res = await db.query(
        `SELECT cat_name FROM categories WHERE cat_name = $1`,
        [value],
      );
      if (res.rows.length > 0) {
        throw new Error("Category name already exists");
      }
      return true;
    }),
  asyncHandler(async (req, res, next) => {
    const categoryName = req.body.categoryName;

    const err = validationResult(req);

    if (!err.isEmpty()) {
      //validation error
      return res.render("dashboard", {
        title: "Dashboard",
        modal: true,
        categories: await db.query("SELECT * FROM categories").rows,
        userInput: categoryName,
        errors: err.array(),
      });
    }

    const response = await db.query(
      `INSERT INTO categories(cat_name) VALUES ($1);`,
      [categoryName],
    );
    if (response.rowCount === 0) {
      //wasnt able to insert, server error
      throw new Error("Server error");
    }

    //successful insert
    res.redirect("/dashboard");
    return;
  }),
];

const categoryUpdateForm = [
  body("password").custom((value, { req }) => {
    console.log(value);
    if (value !== process.env.ADMIN_PASSWORD) {
      throw new Error("Incorrect password");
    }

    return true;
  }),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.render("adminCheck", {
        title: "Admin Auth",
        path: req.originalUrl,
        errors: err.array(),
      });
    }
    const category = await db.query(
      `
      SELECT categories.id AS cat_id, cat_name, items.id AS item_id, item_name, quantity, price
      FROM categories
      LEFT JOIN items
      ON categories.id = items.category_id
      WHERE categories.id = $1;
      `,
      [req.params.id],
    );

    const cat = category.rows[0].cat_name;
    const categoryTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
    res.render("category", {
      title: categoryTitle,
      items: category.rows,
      categoryId: category.rows[0].cat_id,
      admin: true,
    });
  }),
];

const deleteCategoryConfirm = asyncHandler(async (req, res, next) => {
  const cat_id = req.body.toDelete;

  const category = (
    await db.query(
      `SELECT *, cat_name AS _name FROM categories WHERE id = $1`,
      [cat_id],
    )
  ).rows;

  res.render("confirmDelete", {
    title: "Confirm Category Delete",
    type: "category",
    toDelete: category,
    returnPath: `/dashboard/categories/${category[0].id}`,
  });
});

module.exports = {
  singleCategoryGet,
  createCategoryGet,
  createCategoryPost,
  categoryUpdateForm,
  deleteCategoryConfirm,
  confirmCreatePost,
};
