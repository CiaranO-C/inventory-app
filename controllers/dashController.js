const asyncHandler = require("express-async-handler");
const db = require("../db/pool");

const dashboardGet = asyncHandler(async (req, res, next) => {
  const categories = await db.query("SELECT * FROM categories");
  const count = await db.query(`
    SELECT 
      COUNT(CASE WHEN quantity > 0 THEN 1 END) AS in_stock, 
      COUNT(CASE WHEN quantity <= 10 AND quantity > 0 THEN 1 END) AS low_stock,
      COUNT(CASE WHEN quantity = 0 THEN 1 END) AS out_of_stock
    FROM items;`);
    console.log(count.rows[0])
  res.render("dashboard", {
    title: "Dashboard",
    categories: categories.rows,
    count: count.rows[0]
  });
});

module.exports = { dashboardGet };
