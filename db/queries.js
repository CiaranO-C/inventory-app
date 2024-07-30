const db = require("./pool");

async function getInStockItems() {
  const res = await db.query(
    `SELECT items.*, categories.cat_name 
      FROM items 
      JOIN categories 
      ON items.category_id = categories.id 
      WHERE quantity > 0
      ORDER BY item_name DESC;`,
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

module.exports = { getInStockItems, getLowStockItems, getOutOfStockItems };
