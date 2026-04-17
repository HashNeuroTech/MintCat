# MintCat

MintCat 是一个基于 `Next.js + Supabase + ActivityPub` 的联邦社交平台 Web 项目。  
这个仓库已经不只是静态页面，而是一个可本地运行、可接 Supabase、可继续部署到公网的联邦社交产品骨架。

## 产品定位

- 联邦社交平台
- 支持跨实例连接、身份迁移与社区自治
- 中文 / 英文双语界面
- Mint 视觉风格的 Web 端社交体验

## 当前已经实现的能力

### 1. Web 产品层

- Mastodon 风格三栏布局
- 左侧搜索、个人信息、发帖器
- 中间联邦时间线
- 右侧导航、趋势、关注列表、支付入口
- 中英切换
- 自定义头像
- 薄荷绿品牌视觉与 MintCat Logo

### 2. 发帖与互动

- 文字发帖
- 链接发帖
- 图片上传
- 表情库
- 投票发帖
- 公开范围选择
- 语言选择
- 500 字限制
- 评论
- 转发
- 点赞
- 收藏
- 删除

### 3. 联邦协议能力

- WebFinger:
  - `/.well-known/webfinger`
- ActivityPub Actor:
  - `/users/:username`
- Inbox:
  - `/users/:username/inbox`
- Outbox:
  - `/users/:username/outbox`
- Followers:
  - `/users/:username/followers`
- Following:
  - `/users/:username/following`
- Status object:
  - `/users/:username/statuses/:postId`

### 4. 远程社交能力

- 远程用户搜索
- WebFinger 远程发现
- 远程 Actor 导入
- Follow 请求
- Following 列表
- 联邦帖子混合进时间线

### 5. 运营与后台

- 管理后台 `/admin`
- 举报队列
- 审核动作记录
- 实例规则管理
- 风控事件面板
- 健康检查接口 `/api/ops/health`
- 队列任务状态查看

### 6. 支付与资金模式

- 支持页 `/support`
- 支持 Mastodon 风格社区资助模式
- 已预留真实支付入口：
  - 支付宝
  - 微信支付
  - Stripe
  - GitHub Sponsors
  - Visa / 银行卡

## 技术亮点

### 前端技术

- `Next.js 15`
- `React 19`
- App Router 架构
- Server Components + Route Handlers
- 纯组件化前端结构
- 自定义 MintCat 品牌 UI
- 中英文文案切换
- 面向社交产品的三栏式响应布局

### 后端与数据层

- `Supabase Postgres`
- `Supabase Storage`
- `@supabase/supabase-js`
- 本地 fallback store，用于未配置 Supabase 时继续开发
- JSON API 路由全部内置在 Next.js `app/api/*`

### 联邦协议实现

- `ActivityPub`
- `WebFinger`
- Actor / Inbox / Outbox / Followers / Following / Note object
- HTTP Signatures 投递骨架
- 联邦投递队列
- 队列失败重试
- 后续可扩展为独立 worker / cron 架构

### 媒体与内容能力

- 图片上传接口 `/api/uploads`
- 可接 Supabase Storage public bucket
- 链接预览服务 `/api/link-preview`
- 服务端抓取标题、描述、站点名、图片
- 预览缓存
- Host 失败熔断
- SSRF 风险拦截与 allowlist
- 投票独立表：
  - `oracat_poll_votes`

### 安全与生产化能力

- RLS / Storage policy SQL
- 上传限流
- 发帖限流
- 链接抓取限流
- 风控事件自动记录
- 健康检查接口
- Vercel cron 模板
- SMTP / Sentry / 日志 / 备份环境变量模板
- 隐私政策页 `/privacy`
- 服务条款页 `/terms`

## 项目结构

- [app/page.js](/Users/linyuanyuan/Documents/New%20project/mintcat/app/page.js)
  首页入口
- [components/MintSocialExperience.jsx](/Users/linyuanyuan/Documents/New%20project/mintcat/components/MintSocialExperience.jsx)
  主社交界面
- [components/MintAuthExperience.jsx](/Users/linyuanyuan/Documents/New%20project/mintcat/components/MintAuthExperience.jsx)
  登录注册体验
- [components/MintCatLogo.jsx](/Users/linyuanyuan/Documents/New%20project/mintcat/components/MintCatLogo.jsx)
  品牌 Logo
- [app/globals.css](/Users/linyuanyuan/Documents/New%20project/mintcat/app/globals.css)
  全局样式系统
- [lib/oracat/repository.js](/Users/linyuanyuan/Documents/New%20project/mintcat/lib/oracat/repository.js)
  核心数据仓储与时间线聚合
- [lib/oracat/link-preview.js](/Users/linyuanyuan/Documents/New%20project/mintcat/lib/oracat/link-preview.js)
  服务端链接预览抓取
- [lib/oracat/rate-limit.js](/Users/linyuanyuan/Documents/New%20project/mintcat/lib/oracat/rate-limit.js)
  限流逻辑
- [lib/oracat/risk-events.js](/Users/linyuanyuan/Documents/New%20project/mintcat/lib/oracat/risk-events.js)
  风控事件记录
- [app/api/posts/route.js](/Users/linyuanyuan/Documents/New%20project/mintcat/app/api/posts/route.js)
  发帖接口
- [app/api/uploads/route.js](/Users/linyuanyuan/Documents/New%20project/mintcat/app/api/uploads/route.js)
  图片上传接口
- [app/api/link-preview/route.js](/Users/linyuanyuan/Documents/New%20project/mintcat/app/api/link-preview/route.js)
  链接预览接口
- [app/api/federation/process-queue/route.js](/Users/linyuanyuan/Documents/New%20project/mintcat/app/api/federation/process-queue/route.js)
  队列处理接口
- [app/admin/page.js](/Users/linyuanyuan/Documents/New%20project/mintcat/app/admin/page.js)
  管理后台
- [app/support/page.js](/Users/linyuanyuan/Documents/New%20project/mintcat/app/support/page.js)
  资助页

## 数据库与 SQL

这些 SQL 文件位于 [supabase](/Users/linyuanyuan/Documents/New%20project/supabase) 目录：

- [mintcat_federation_schema.sql](/Users/linyuanyuan/Documents/New%20project/supabase/mintcat_federation_schema.sql)
  联邦账号、帖子、关注、远程 Actor、队列表
- [mintcat_media_poll_migration.sql](/Users/linyuanyuan/Documents/New%20project/supabase/mintcat_media_poll_migration.sql)
  媒体、投票、语言、链接预览、投票表
- [mintcat_storage_policies.sql](/Users/linyuanyuan/Documents/New%20project/supabase/mintcat_storage_policies.sql)
  Storage bucket 与基础策略
- [mintcat_moderation_schema.sql](/Users/linyuanyuan/Documents/New%20project/supabase/mintcat_moderation_schema.sql)
  举报、审核、规则、风控事件

## 本地运行

在项目目录下运行：

```bash
cd "/Users/linyuanyuan/Documents/New project/mintcat"
npm install
npm run dev
```

生产预览：

```bash
cd "/Users/linyuanyuan/Documents/New project/mintcat"
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

## 环境变量

最核心的环境变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ORACAT_BASE_URL=
ORACAT_QUEUE_TOKEN=
ORACAT_MEDIA_BUCKET=mintcat-media
ORACAT_LINK_PREVIEW_ALLOWLIST=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
LOG_LEVEL=info
BACKUP_WEBHOOK_URL=
```

完整模板见：

- [/.env.example](/Users/linyuanyuan/Documents/New%20project/mintcat/.env.example)
- [docs/production-readiness.md](/Users/linyuanyuan/Documents/New%20project/mintcat/docs/production-readiness.md)
- [docs/deployment-templates.md](/Users/linyuanyuan/Documents/New%20project/mintcat/docs/deployment-templates.md)

## 当前命名说明

对外产品名已经统一为 `MintCat`。  
目前数据库表名和部分底层库目录里仍保留了 `oracat_*` / `lib/oracat/*` 这样的内部命名，这是历史实现遗留，不影响运行，但后续如果你要彻底品牌统一，可以继续做一轮底层命名迁移。

## 当前状态判断

这不是纯 demo 了，而是一个：

- 可本地运行
- 可接 Supabase
- 可继续部署
- 可做小规模内测

的联邦社交平台 Web Beta。

如果你愿意，我下一步可以继续帮你做最后一轮品牌统一，把这些内部的 `oracat` 命名也系统迁成 `mintcat`。  
