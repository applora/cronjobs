# 部署指南

## GitHub Actions 自动部署

本项目已配置 GitHub Actions 自动部署到服务器。

### 需要配置的 GitHub Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

1. **SERVER_PASSWORD**
   - 服务器 root 用户的密码

2. **HOST**
   - 域名，例如：supercrawler.localhost

### 部署流程

1. **触发方式**：
   - 推送代码到 `main` 分支自动触发
   - 在 Actions 页面手动触发

2. **部署步骤**：
   - 拉取最新代码
   - 生成新的 API Key (32位十六进制字符串)
   - 创建 `.env` 文件
   - 停止旧的容器
   - 构建并启动新的 Docker 容器
   - 显示部署状态

### 环境变量配置

部署时会自动创建 `.env` 文件，包含以下变量：

```env
NODE_ENV=production
REDIS_URL=redis://redis:6379
PORT=3000
HOST=${{ secrets.HOST }}
API_KEY=自动生成的32位密钥
```

### 访问地址

部署成功后可以通过以下地址访问：

- **主应用**：https://[你的域名]
- **Traefik Dashboard**：http://194.195.92.198:8080

### 手动部署（备用方案）

如果自动部署失败，可以手动 SSH 到服务器执行：

```bash
# SSH 连接
ssh root@194.195.92.198

# 进入项目目录
cd /root/supercrawler

# 拉取最新代码
git pull origin main

# 创建 .env 文件
cat > .env << EOF
NODE_ENV=production
REDIS_URL=redis://redis:6379
PORT=3000
HOST=你的域名
API_KEY=你的API密钥
EOF

# 重新部署
docker-compose down
docker-compose up -d --build
```

### 故障排查

1. **查看日志**：
   ```bash
   docker-compose logs -f
   ```

2. **检查服务状态**：
   ```bash
   docker-compose ps
   ```

3. **重启服务**：
   ```bash
   docker-compose restart
   ```

4. **清理 Docker 资源**：
   ```bash
   docker system prune -f
   ```