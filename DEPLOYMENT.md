# 部署指南

## 📦 项目已提交到本地 Git 仓库

✅ 代码已成功提交到本地 Git 仓库
- Commit ID: `5c60380`
- 31 个文件，11,399 行代码

## 🚀 部署选项

### 方案 1：GitHub + Vercel（推荐）

#### 步骤 1：推送到 GitHub

```bash
# 1. 在 GitHub 创建新仓库
# 访问：https://github.com/new
# 仓库名：feishu-table-plugin

# 2. 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/feishu-table-plugin.git

# 3. 推送代码
git branch -M main
git push -u origin main
```

#### 步骤 2：部署到 Vercel

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
vercel

# 4. 生产环境部署
vercel --prod
```

**或者使用 Vercel 网页部署：**
1. 访问 https://vercel.com
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 自动检测配置并部署
5. 获得部署 URL：`https://your-project.vercel.app`

---

### 方案 2：GitHub + Netlify

#### 步骤 1：推送到 GitHub（同上）

#### 步骤 2：部署到 Netlify

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录 Netlify
netlify login

# 3. 初始化项目
netlify init

# 4. 部署
netlify deploy --prod
```

**或者使用 Netlify 网页部署：**
1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 "Deploy site"
6. 获得部署 URL：`https://your-project.netlify.app`

---

### 方案 3：GitHub Pages

#### 添加部署脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/feishu-table-plugin"
}
```

#### 部署步骤

```bash
# 1. 安装 gh-pages
npm install --save-dev gh-pages

# 2. 推送到 GitHub（同方案 1）

# 3. 部署到 GitHub Pages
npm run deploy
```

访问：`https://YOUR_USERNAME.github.io/feishu-table-plugin`

---

### 方案 4：自建服务器（Nginx）

#### 步骤 1：构建项目

```bash
npm run build
```

#### 步骤 2：上传到服务器

```bash
# 使用 SCP 上传
scp -r dist/* user@your-server.com:/var/www/feishu-poster
```

#### 步骤 3：配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/feishu-poster;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

```bash
# 重启 Nginx
sudo systemctl restart nginx
```

---

## 🌐 推荐部署平台对比

| 平台 | 优点 | 缺点 | 价格 |
|------|------|------|------|
| **Vercel** | 自动部署、CDN、HTTPS、极快 | 国内访问可能较慢 | 免费 |
| **Netlify** | 易用、CDN、HTTPS、表单处理 | 构建时间限制 | 免费 |
| **GitHub Pages** | 简单、稳定、免费 | 仅静态、功能有限 | 免费 |
| **自建服务器** | 完全控制、国内访问快 | 需要维护、成本高 | 付费 |

---

## 📝 部署前检查清单

- [ ] 代码已提交到 Git
- [ ] 所有依赖已安装（`npm install`）
- [ ] 本地构建成功（`npm run build`）
- [ ] 测试功能正常
- [ ] 更新 README.md 中的部署 URL
- [ ] 配置环境变量（如需要）

---

## 🔧 环境变量配置

如果需要配置飞书 API 密钥等敏感信息：

### Vercel
```bash
vercel env add FEISHU_APP_ID
vercel env add FEISHU_APP_SECRET
```

### Netlify
```bash
netlify env:set FEISHU_APP_ID "your-app-id"
netlify env:set FEISHU_APP_SECRET "your-app-secret"
```

---

## 📊 当前本地服务

开发服务器正在运行：
- **本地地址**: http://localhost:3000
- **网络地址**: http://192.168.5.168:3000
- **状态**: 运行中（Terminal ID: 14）

---

## 🎯 快速部署（推荐流程）

### 最简单的方式：Vercel

```bash
# 1. 创建 GitHub 仓库并推送代码
git remote add origin https://github.com/YOUR_USERNAME/feishu-table-plugin.git
git push -u origin main

# 2. 访问 Vercel 并导入项目
# https://vercel.com/new

# 3. 等待自动部署完成
# 获得 URL：https://feishu-table-plugin.vercel.app
```

**预计时间：5 分钟**

---

## 📞 需要帮助？

如果在部署过程中遇到问题，请检查：

1. **构建失败** - 查看构建日志，检查依赖是否完整
2. **页面空白** - 检查路由配置，确保 SPA 路由正确
3. **资源 404** - 检查 `publicPath` 配置
4. **API 调用失败** - 检查 CORS 配置和环境变量

---

## 🎉 部署成功后

1. 测试所有功能
2. 分享部署 URL
3. 配置自定义域名（可选）
4. 设置 HTTPS（大多数平台自动配置）
5. 监控访问统计

