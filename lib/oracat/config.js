export const ACTIVITY_STREAMS_CONTEXT = "https://www.w3.org/ns/activitystreams";
export const PUBLIC_ADDRESS = "https://www.w3.org/ns/activitystreams#Public";

export function getBaseUrl(request) {
  const candidate =
    process.env.ORACAT_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || request?.nextUrl?.origin || "http://localhost:3000";

  return candidate.replace(/\/$/, "");
}

export function getHostFromRequest(request) {
  return new URL(getBaseUrl(request)).host;
}

export function normalizeUsername(value) {
  const source = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/@.*$/, "")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return source || "member";
}

export function actorUrl(baseUrl, username) {
  return `${baseUrl}/users/${username}`;
}

export function inboxUrl(baseUrl, username) {
  return `${baseUrl}/users/${username}/inbox`;
}

export function outboxUrl(baseUrl, username) {
  return `${baseUrl}/users/${username}/outbox`;
}

export function followersUrl(baseUrl, username) {
  return `${baseUrl}/users/${username}/followers`;
}

export function followingUrl(baseUrl, username) {
  return `${baseUrl}/users/${username}/following`;
}

export function noteUrl(baseUrl, username, postId) {
  return `${baseUrl}/users/${username}/statuses/${postId}`;
}

export function activityUrl(baseUrl, username, postId) {
  return `${baseUrl}/users/${username}/activities/${postId}`;
}

export function webfingerResource(username, host) {
  return `acct:${username}@${host}`;
}

export function jsonHeaders(contentType = "application/json; charset=utf-8") {
  return {
    "Content-Type": contentType,
    Vary: "Accept"
  };
}
