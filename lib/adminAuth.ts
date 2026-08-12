/**
 * MOCK ADMIN AUTH — placeholder until there's a backend.
 *
 * These credentials are hardcoded and shipped in client-side JS, so anyone who
 * opens devtools can read them. That's fine for now since there's no real data
 * at stake (everything lives in localStorage), but this must not be treated as
 * real security.
 *
 * When the backend exists, replace checkAdminCredentials() with a call to an
 * API route (e.g. POST /api/admin/login) that checks against server-side env
 * vars instead — something like:
 *
 *   ADMIN_EMAIL=admin@connectvibeco.com
 *   ADMIN_PASSWORD=<hashed or plain, checked server-side only>
 *
 * and never expose those values to the client.
 */

const ADMIN_EMAIL = "admin@connectvibeco.com";
const ADMIN_PASSWORD = "connectvibe-admin";

const SESSION_KEY = "connectvibe:admin-authed";

export function checkAdminCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
}

export function setAdminAuthed() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // storage unavailable - ignore
  }
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearAdminAuth() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable - ignore
  }
}
