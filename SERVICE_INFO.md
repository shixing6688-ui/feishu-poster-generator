# 🎉 飞书多维表海报生成器 - 服务信息

## ✅ 项目状态

- **构建状态**: ✅ 成功
- **代码提交**: ✅ 已提交到本地 Git 仓库
- **最新提交**: `dfe7d13` - 修复构建错误并添加图片上传功能
- **构建产物**: `dist/` 目录（242 KB）

---

## 🌐 当前服务地址

### 本地开发服务器

**状态**: 🟢 运行中

- **本地访问**: http://localhost:3000
- **局域网访问**: http://192.168.5.168:3000
- **终端 ID**: 14

### 访问方式

1. **同一台电脑访问**
   ```
   http://localhost:3000
   ```

2. **同一局域网内其他设备访问**（手机、平板、其他电脑）
   ```
   http://192.168.5.168:3000
   ```
   
   📱 可以用手机扫描二维码访问（需要在同一 WiFi 下）

---

## 🚀 部署到公网（推荐方案）

### 方案 1：Vercel（最简单，推荐）⭐

**优点**: 免费、自动部署、全球 CDN、HTTPS

#### 步骤：

1. **推送到 GitHub**
   ```bash
   # 在 GitHub 创建新仓库: https://github.com/new
   # 仓库名: feishu-table-plugin
   
   git remote add origin https://github.com/YOUR_USERNAME/feishu-table-plugin.git
   git branch -M main
   git push -u origin main
   ```

2. **部署到 Vercel**
   - 访问: https://vercel.com
   - 点击 "Import Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 获得 URL: `https://feishu-table-plugin.vercel.app`

**预计时间**: 5 分钟

---

### 方案 2：Netlify

**优点**: 免费、易用、表单处理

#### 步骤：

1. **推送到 GitHub**（同上）

2. **部署到 Netlify**
   - 访问: https://netlify.com
   - 点击 "New site from Git"
   - 选择你的 GitHub 仓库
   - 构建设置:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 点击 "Deploy site"
   - 获得 URL: `https://your-project.netlify.app`

**预计时间**: 5 分钟

---

### 方案 3：GitHub Pages

**优点**: 完全免费、稳定

#### 步骤：

```bash
# 1. 安装 gh-pages
npm install --save-dev gh-pages

# 2. 在 package.json 添加脚本
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist",
# "homepage": "https://YOUR_USERNAME.github.io/feishu-table-plugin"

# 3. 推送到 GitHub（同方案 1）

# 4. 部署
npm run deploy
```

访问: `https://YOUR_USERNAME.github.io/feishu-table-plugin`

**预计时间**: 10 分钟

---

## 📦 项目信息

### 技术栈

- **前端框架**: React 17 + TypeScript
- **构建工具**: Webpack 5
- **样式**: CSS
- **API 调用**: Axios
- **存储**: LocalStorage
- **渲染**: Canvas API

### 功能特性

✅ 可视化海报模板设计器
✅ 拖拽移动元素
✅ 18 种精美背景预设（纯色 + 渐变）
✅ 本地图片上传功能
✅ 飞书多维表数据集成
✅ 字段映射配置
✅ 实时预览
✅ 批量生成海报
✅ 多种导出方式（PNG、JPG、PDF）
✅ 模板管理（保存/加载/删除）
✅ 模拟数据测试

### 构建产物

```
dist/
├── bundle.js       (242 KB - 已压缩)
├── bundle.js.map   (源码映射)
└── index.html      (344 bytes)
```

---

## 🔧 本地开发

### 启动开发服务器

```bash
npm start
# 或
npm run dev
```

访问: http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录

### 预览生产版本

```bash
# 安装 serve
npm install -g serve

# 预览
serve -s dist -p 3000
```

---

## 📱 移动端访问

### 同一局域网访问

1. 确保手机和电脑在同一 WiFi
2. 在手机浏览器访问: `http://192.168.5.168:3000`
3. 可以正常使用所有功能

### 公网访问

部署到 Vercel/Netlify 后，可以在任何地方访问

---

## 🎯 快速开始

### 1. 创建模板

1. 打开应用
2. 点击 "创建新模板"
3. 设置海报尺寸（默认 800x1200）
4. 添加元素：
   - 📄 背景（选择预设或上传图片）
   - 📝 文本（标题、描述等）
   - 🖼️ 图片（上传本地图片）
   - 🏷️ 标签（分类标签）

### 2. 配置字段映射

1. 连接飞书多维表（或使用模拟数据）
2. 将表格字段映射到模板元素
3. 实时预览效果

### 3. 生成海报

1. 点击 "批量生成"
2. 选择导出格式（PNG/JPG/PDF）
3. 下载海报

---

## 📞 技术支持

### 常见问题

**Q: 构建失败怎么办？**
A: 删除 `node_modules` 和 `package-lock.json`，重新运行 `npm install`

**Q: 图片上传后不显示？**
A: 检查图片格式是否支持（JPG、PNG、GIF、WebP）

**Q: 批量下载 ZIP 失败？**
A: 需要安装 jszip: `npm install jszip`，或使用顺序下载

**Q: 飞书 API 调用失败？**
A: 检查 App ID 和 App Secret 是否正确，以及权限配置

---

## 📊 性能优化建议

1. **图片优化**: 上传前压缩图片，建议单张不超过 2MB
2. **批量生成**: 建议每次不超过 50 张海报
3. **浏览器**: 推荐使用 Chrome、Edge、Safari 最新版本
4. **缓存**: 模板自动保存到 LocalStorage

---

## 🎉 部署成功后

1. ✅ 测试所有功能
2. ✅ 分享部署 URL
3. ✅ 配置自定义域名（可选）
4. ✅ 设置 HTTPS（Vercel/Netlify 自动配置）
5. ✅ 监控访问统计

---

**祝你使用愉快！🎊**

