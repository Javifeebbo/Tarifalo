import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run with: npx dotenv -e .env.local -- node scripts/migrate.mjs");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

const schema = readFileSync(path.join(__dirname, "schema.sql"), "utf8");

try {
  await sql.unsafe(schema);
  console.log("Schema applied successfully.");
} finally {
  await sql.end();
}
