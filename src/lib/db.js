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

if (process.env.DATABASE_URL) {
  try {
    console.log("DB URL HOST:", new URL(process.env.DATABASE_URL).hostname);
  } catch (err) {
    // If DATABASE_URL is malformed, avoid throwing during build/collect phase
    console.warn("Invalid DATABASE_URL:", err.message || err);
  }
} else {
  // Avoid calling new URL(undefined) during Next.js build/collect
  console.warn("DATABASE_URL not set");
}
