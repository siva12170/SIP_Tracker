import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connectDB() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    console.log("MySQL Connected");
    conn.release();
  } catch (err) {
    console.log("Database Connection Failed");
    console.log(err);
  }
}

export { pool, connectDB };