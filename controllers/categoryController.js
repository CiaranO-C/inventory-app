const db = require("../db/pool");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

function allCategoriesGet(req, res, next) {
  res.render("categories");
}

function singleCategoryGet(req, res, next) {
  const id = req.params.id;
  res.send(`this is the ${id} category!`);
}

const createCategoryGet = asyncHandler(async (req, res, next) => {
  res.render("dashboard", {
    modal: true,
    categories: (await db.query("SELECT * FROM categories")).rows,
  });
});

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

function updateCategoryGet(req, res, next) {
  res.send("update category GET");
}

function updateCategoryPost(req, res, next) {
  res.send("update category POST");
}

module.exports = {
  allCategoriesGet,
  singleCategoryGet,
  createCategoryGet,
  createCategoryPost,
  updateCategoryGet,
  updateCategoryPost,
};
