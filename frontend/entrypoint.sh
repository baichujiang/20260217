#!/bin/sh
# 容器启动时把 Render 注入的环境变量写入前端可加载的脚本，解决 Docker 构建时拿不到 NEXT_PUBLIC_* 的问题
API_URL="${NEXT_PUBLIC_API_BASE_URL:-}"
# 转义双引号，避免破坏 JS
API_URL_ESCAPED=$(echo "$API_URL" | sed 's/"/\\"/g')
printf '%s\n' "window.__API_BASE_URL__=\"$API_URL_ESCAPED\";" > /app/public/env-config.js
exec npm start
