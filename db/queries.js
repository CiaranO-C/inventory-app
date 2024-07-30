const db = require("./pool");

async function getInStockItems(sort, order) {
  const res = await db.query(
    `
    SELECT items.*, categories.cat_name 
      FROM items 
      JOIN categories 
      ON items.category_id = categories.id 
      WHERE quantity > 0
      ORDER BY $1 DESC;`,
    [sort],
  );
  return res.rows;
}

async function getLowStockItems() {
  const res = await db.query(
    `SELECT items.*, categories.cat_name 
      FROM items 
      JOIN categories 
      ON items.category_id = categories.id 
      WHERE quantity <= 10 AND quantity > 0
      ORDER BY item_name DESC;`,
  );
  return res.rows;
}

async function getOutOfStockItems() {
  const res = await db.query(`
    SELECT items.*, categories.cat_name 
      FROM items 
      JOIN categories 
      ON items.category_id = categories.id  
      WHERE quantity = 0
      ORDER BY item_name DESC;`);
  return res.rows;
}

async function getSortedItems(sort, order, condition) {
  const conditions = [
    "quantity > 0",
    "quantity = 0",
    "quantity <= 10 AND quantity > 0",
  ];
  const orders = ["ASC", "DESC"];

  const sorts = ["cat_name", "price", "quantity", "item_name"];

  if (conditions.includes(condition) && orders.includes(order) && sorts.includes(sort)) {
    let sql = `
    SELECT items.*, categories.cat_name
    FROM items
    JOIN categories
    ON items.category_id = categories.id
    WHERE ${condition}
    ORDER BY ${sort} ${order};
    `;
    const sorted = await db.query(sql);
    return sorted.rows;
  } else {
    return false;
  }
}

module.exports = {
  getInStockItems,
  getLowStockItems,
  getOutOfStockItems,
  getSortedItems,
};
