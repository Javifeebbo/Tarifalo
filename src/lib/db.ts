import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

/**
 * Reused across hot reloads / serverless invocations instead of opening a
 * fresh pool per request (Neon has connection limits on the free tier).
 */
export const sql = globalThis.__sql ?? postgres(process.env.DATABASE_URL!, { ssl: "require" });

if (process.env.NODE_ENV !== "production") {
  globalThis.__sql = sql;
}
