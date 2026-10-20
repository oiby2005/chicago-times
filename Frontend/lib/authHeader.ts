/**
 * Utility to retrieve the active JWT token from browser session storage
 * and build authorization headers & fetch options for backend requests.
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  // Prioritize sessionStorage (destroyed on browser tab/close) over localStorage
  return sessionStorage.getItem("wsj_token") || localStorage.getItem("wsj_token") || null;
}

export function getAuthHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const token = getAuthToken();
  const result: Record<string, string> = { ...headers };
  if (token) {
    result["Authorization"] = `Bearer ${token}`;
  }
  return result;
}

/**
 * Standard fetch options ensuring credentials (httpOnly session cookies)
 * and Authorization headers are automatically attached.
 */
export function getFetchOptions(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    credentials: "include",
    headers: getAuthHeaders((options.headers as Record<string, string>) || {}),
  };
}
