// import mysql from "mysql2/promise";

// export const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "0000",
//   database: "qr_surprise"
// });


import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
console.log("DB URL HOST:", new URL(process.env.DATABASE_URL).hostname);
