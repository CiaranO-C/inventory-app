const asyncHandler = require("express-async-handler");
const db = require("../db/pool");

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
  console.log(item.rows)
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

function updateItemPost(req, res, next) {
  res.send("updated an item!");
}

module.exports = {
  allItemsGet,
  singleItemGet,
  createItemGet,
  updateItemGet,
  createItemPost,
  updateItemPost,
};
