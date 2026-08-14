import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Thrown at request time, not at build time — Next.js can build without
  // the env var present, but any route that imports `sql` will fail loudly
  // instead of silently doing nothing.
  console.warn("DATABASE_URL is not set. Database calls will fail until it is configured in Vercel.");
}

// `neon()` returns a tagged-template query function backed by Neon's HTTP
// driver — no persistent connection/pool to manage, which is what you want
// on Vercel's serverless functions.
export const sql = neon(connectionString ?? "");
