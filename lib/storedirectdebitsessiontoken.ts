const SESSION_TOKEN_KEY = "gocardless_direct_debit_session_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function storeDirectDebitSessionToken(token: string) {
  if (!isBrowser()) return;
  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function getDirectDebitSessionToken() {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearDirectDebitSessionToken() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
}