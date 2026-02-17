# Render 部署配置说明

根据当前项目（前端 Next.js + 后端 FastAPI），在 Render 上需要创建以下资源。

---

## 一、要创建的服务类型

| 类型 | 数量 | 用途 |
|-----|------|------|
| **Postgres** | 0 或 1 | 若用 Render 托管数据库则建 1 个；若继续用现有库可跳过 |
| **Web Service** | 2 | 一个跑后端，一个跑前端 |

---

## 二、步骤 1：数据库（可选）

若你打算用 **Render 的 Postgres**（不用本机或其它云数据库）：

1. 在 Render 首页点 **New** → **Postgres**
2. 填名称（如 `team-a2-db`）、选地区、选方案，创建
3. 创建后在 Postgres 的 **Info** 里复制 **Internal Database URL**，后面给后端用

若继续用现有数据库（例如 Supabase 的 Postgres 或其它），可跳过这一步，在后端环境变量里填你已有的 `DATABASE_URL`。

---

## 三、步骤 2：后端 Web Service

1. **New** → **Web Service**
2. 连接仓库：`baichujiang/20260217`
3. 配置：
   - **Name**：如 `team-a2-backend`
   - **Region**：选离用户近的
   - **Root Directory**：`backend`
   - **Environment**：**Docker**
   - **Instance Type**：按需选择（免费或付费）

4. **Environment Variables**（在服务 **Environment** 里添加）：

   | Key | Value | 说明 |
   |-----|--------|------|
   | `DATABASE_URL` | （见下） | 若用 Render Postgres：从 Postgres 服务复制 **Internal Database URL**，并把协议改成 `postgresql+asyncpg://`（若当前是 `postgres://`，把开头的 `postgres://` 换成 `postgresql+asyncpg://`）<br>若用现有库：填你已有的连接串 |
   | `SECRET_KEY` | 一串随机字符串 | 用于 JWT，可用 `openssl rand -hex 32` 生成 |
   | `FRONTEND_URL` | 见下 | 前端部署后的地址，如 `https://xxx.onrender.com`（先可填占位，前端建好再改） |
   | `SUPABASE_URL` | 你的 Supabase 项目 URL | 从 Supabase 控制台复制 |
   | `SUPABASE_KEY` | 你的 Supabase anon key | 从 Supabase 控制台复制 |
   | `ALGORITHM` | `HS256` | 可选，不填则用代码默认值 |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | 可选 |

5. 保存并 **Deploy**。部署完成后记下后端地址，例如：`https://team-a2-backend.onrender.com`

---

## 四、步骤 3：前端 Web Service

1. **New** → **Web Service**
2. 连接**同一个仓库**：`baichujiang/20260217`
3. 配置：
   - **Name**：如 `team-a2-frontend`
   - **Region**：与后端相同
   - **Root Directory**：`frontend`
   - **Environment**：**Docker**
   - **Instance Type**：按需选择

4. **Environment Variables**：

   | Key | Value |
   |-----|--------|
   | `NEXT_PUBLIC_API_BASE_URL` | 后端地址，如 `https://team-a2-backend.onrender.com`（不要末尾斜杠） |

5. 保存并 **Deploy**

---

## 五、步骤 4：把前端地址填回后端

前端部署好后：

1. 打开**后端** Web Service → **Environment**
2. 把 `FRONTEND_URL` 改成前端的真实地址，例如：`https://team-a2-frontend.onrender.com`
3. 保存（会触发重新部署）

---

## 六、小结

- **Postgres**：可选，仅当用 Render 托管数据库时建一个。
- **两个 Web Service**：  
  - 一个 Root Directory = `backend`（用 `backend/Dockerfile`）  
  - 一个 Root Directory = `frontend`（用 `frontend/Dockerfile`）
- 前端通过 `NEXT_PUBLIC_API_BASE_URL` 调后端；后端通过 `FRONTEND_URL` 做 CORS 等。
- 数据库与 Supabase 相关变量按你现有配置填写即可。

这样前后端就都在 Render 上跑起来，且各自使用自己的 Dockerfile。
