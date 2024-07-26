const asyncHandler = require("express-async-handler");
const db = require("../db/pool");

const dashboardGet = asyncHandler(async (req, res, next) => {
  const categories = await db.query("SELECT * FROM categories");
  res.render("dashboard", {
    title: "Dashboard",
    categories: categories.rows,
  });
});

module.exports = { dashboardGet };
