const { dotenv } = require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const query = async (sql , params) => {
  console.log("DB Query Sent");
  const res = await pool.query(sql, params);
  return res;
};

module.exports = { query };
