// frontend/src/lib/fetchWithAuth.ts

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/account?redirect=${encodeURIComponent(currentPath)}`;
    throw new Error("Unauthorized");
  }

  return res;
}
