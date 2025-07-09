// frontend/src/lib/fetchWithAuth.ts

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");
  console.log("🚀 Token used in fetch:", token);

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // 若未授权，则跳转登录页面，并带上当前页面作为跳转参数
  if (res.status === 401) {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/account?redirect=${encodeURIComponent(currentPath)}`;
    throw new Error("Unauthorized");
  }

  return res;
}
