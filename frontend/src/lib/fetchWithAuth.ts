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
  
    return fetch(url, {
      ...options,
      headers,
    });
  }
