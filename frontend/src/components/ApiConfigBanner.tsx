"use client";

import { useState, useEffect } from "react";
import { isApiConfigured } from "@/lib/apiBaseUrl";

const MESSAGE =
  "请在 Render 前端服务 Environment 中配置 NEXT_PUBLIC_API_BASE_URL（后端地址），保存后重新部署。";

export function ApiConfigBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isApiConfigured()) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      role="alert"
      className="bg-amber-100 border-b border-amber-400 text-amber-900 px-4 py-2 text-sm flex items-center justify-between gap-4"
    >
      <span>{MESSAGE}</span>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="shrink-0 text-amber-700 hover:underline"
      >
        关闭
      </button>
    </div>
  );
}
