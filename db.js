const { Pool, Client } = require("pg");
const cli = require("nodemon/lib/cli");
const env = require("dotenv").config();

let constring = process.env.dbconstring;
const pool = new Pool({
  connectionString: constring,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
