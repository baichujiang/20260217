/**
 * 后端 API 地址。
 * - Docker 部署：由 entrypoint 写入 window.__API_BASE_URL__（来自 NEXT_PUBLIC_API_BASE_URL），此处优先用运行时值。
 * - 本地/非 Docker：用构建时 NEXT_PUBLIC_API_BASE_URL。
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && window.__API_BASE_URL__ != null) {
    return window.__API_BASE_URL__.replace(/\/$/, "");
  }
  const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return url.replace(/\/$/, "");
}

export function isApiConfigured(): boolean {
  if (typeof window !== "undefined" && window.__API_BASE_URL__) return true;
  return Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);
}
