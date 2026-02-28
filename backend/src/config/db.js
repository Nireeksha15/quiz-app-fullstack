const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "quizdb",
  password: "Nireeksha@6366",
  port: 5432,
});

module.exports = pool;