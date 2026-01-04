# 🚀 GitHub 发布指南

## ✅ Git 配置已完成

```bash
Git 用户名: shixing6688-ui
Git 邮箱: shixing6688@gmail.com
```

---

## 📦 下一步：在 GitHub 创建仓库

### 步骤 1：访问 GitHub 创建仓库页面

**点击这个链接**: https://github.com/new

### 步骤 2：填写仓库信息

```
仓库名称: feishu-poster-generator
描述: 飞书多维表海报生成器 - 可视化设计、批量生成、一键导出

可见性: 
  ○ Public（公开 - 推荐）
  ○ Private（私有）

⚠️ 重要：不要勾选以下选项
  ☐ Add a README file
  ☐ Add .gitignore
  ☐ Choose a license
```

### 步骤 3：点击 "Create repository" 按钮

---

## 🔗 创建仓库后，执行以下命令

### 方式 1：HTTPS（推荐，简单）

```bash
git remote add origin https://github.com/shixing6688-ui/feishu-poster-generator.git
git branch -M main
git push -u origin main
```

第一次推送时会要求输入 GitHub 凭证：
- Username: shixing6688-ui
- Password: 使用 Personal Access Token（不是密码）

### 方式 2：SSH（需要配置 SSH 密钥）

```bash
git remote add origin git@github.com:shixing6688-ui/feishu-poster-generator.git
git branch -M main
git push -u origin main
```

---

## 🔑 如何获取 Personal Access Token

如果你还没有 Personal Access Token：

1. 访问: https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置:
   - Note: `feishu-poster-generator`
   - Expiration: `90 days` 或 `No expiration`
   - 勾选权限: `repo` (全部)
4. 点击 "Generate token"
5. **复制 token**（只显示一次，请保存好）
6. 在推送时使用这个 token 作为密码

---

## 📋 完整操作流程

### 1. 创建 GitHub 仓库
- [ ] 访问 https://github.com/new
- [ ] 仓库名: `feishu-poster-generator`
- [ ] 选择 Public
- [ ] 不勾选任何初始化选项
- [ ] 点击 "Create repository"

### 2. 推送代码
- [ ] 复制 GitHub 提供的命令
- [ ] 或使用上面的命令
- [ ] 输入用户名和 Token
- [ ] 等待推送完成

### 3. 验证
- [ ] 刷新 GitHub 仓库页面
- [ ] 看到所有文件
- [ ] 查看 README.md 显示正常

---

## 🎯 推送完成后

### 仓库地址
```
https://github.com/shixing6688-ui/feishu-poster-generator
```

### 立即部署到 Vercel

1. 访问: https://vercel.com/new
2. 使用 GitHub 登录
3. 导入仓库: `shixing6688-ui/feishu-poster-generator`
4. 点击 "Deploy"
5. 等待 2-3 分钟
6. 获得公网 URL: `https://feishu-poster-generator.vercel.app`

---

## 🆘 常见问题

### Q1: 推送时提示 "Authentication failed"
**解决**: 使用 Personal Access Token 而不是密码

### Q2: 推送时提示 "remote origin already exists"
**解决**: 
```bash
git remote remove origin
git remote add origin https://github.com/shixing6688-ui/feishu-poster-generator.git
```

### Q3: 推送时提示 "Permission denied"
**解决**: 检查 Token 权限是否包含 `repo`

### Q4: 想修改仓库名
**解决**: 
1. 在 GitHub 仓库页面 → Settings → Repository name
2. 修改后更新本地 remote:
```bash
git remote set-url origin https://github.com/shixing6688-ui/新仓库名.git
```

---

## 📞 需要帮助？

创建好仓库后，告诉我，我会帮你执行推送命令！

