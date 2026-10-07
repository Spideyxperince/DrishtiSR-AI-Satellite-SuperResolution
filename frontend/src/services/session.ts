// A new random id is created every time the page is loaded.
// The server keeps each visitor's files and progress under this id, so
// refreshing the page starts clean and other devices never see your images.

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for browsers that cannot make a secure id
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}

export const SESSION_ID = makeId();

// Adds the session id to a backend address
export function withSession(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}sid=${SESSION_ID}`;
}
