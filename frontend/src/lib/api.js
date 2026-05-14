const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("sip_token");
}

export async function apiFetch(
  path,
  init = {}
) {
  const headers = new Headers(init.headers || {});
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}

export { API_BASE_URL };
