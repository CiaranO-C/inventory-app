const pg = require("pg");
const dotenv = require("dotenv").config();

const sql = `
INSERT INTO categories (cat_name) VALUES
('Fruits'),
('Vegetables'),
('Snacks'),
('Meat'),
('Dairy'),
('Beverages'),
('Bakery'),
('Frozen Foods');

INSERT INTO items (category_id, item_name, quantity, price) VALUES
(1, 'Apples', 50, 0.99),
(1, 'Bananas', 100, 0.59),
(1, 'Oranges', 75, 1.29),
(1, 'Grapes', 30, 2.99),
(1, 'Strawberries', 25, 3.49),
(2, 'Carrots', 60, 0.89),
(2, 'Broccoli', 40, 1.49),
(2, 'Lettuce', 35, 1.19),
(2, 'Potatoes', 80, 0.79),
(2, 'Tomatoes', 45, 1.29),
(3, 'Potato Chips', 120, 2.49),
(3, 'Pretzels', 90, 1.99),
(3, 'Cookies', 50, 3.79),
(3, 'Granola Bars', 60, 2.29),
(3, 'Popcorn', 70, 1.79),
(4, 'Chicken Breast', 25, 5.99),
(4, 'Ground Beef', 20, 6.49),
(4, 'Pork Chops', 15, 7.99),
(4, 'Salmon Fillets', 10, 8.99),
(4, 'Bacon', 30, 4.49),
(5, 'Milk', 40, 2.59),
(5, 'Cheese', 25, 3.89),
(5, 'Yogurt', 50, 1.49),
(5, 'Butter', 20, 2.79),
(5, 'Eggs', 60, 1.99),
(6, 'Orange Juice', 35, 3.29),
(6, 'Soda', 100, 1.19),
(6, 'Coffee', 25, 4.99),
(6, 'Tea', 40, 2.29),
(6, 'Water', 120, 0.99),
(7, 'Bread', 50, 2.49),
(7, 'Bagels', 40, 3.99),
(7, 'Muffins', 30, 4.29),
(7, 'Croissants', 20, 3.69),
(7, 'Donuts', 25, 2.99),
(8, 'Frozen Pizza', 30, 5.49),
(8, 'Ice Cream', 20, 4.99),
(8, 'Frozen Vegetables', 25, 2.89),
(8, 'Frozen Meals', 15, 6.49),
(8, 'Frozen Fruits', 10, 3.99);
`;

async function main() {
  const client = new pg.Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log("done");
}

main();
