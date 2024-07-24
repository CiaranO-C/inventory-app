const { dotenv } = require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

async function query(sql, params) {
  console.log("im here!");
  const res = await pool.query(sql, params);
  return res;
}

module.exports = { query };
