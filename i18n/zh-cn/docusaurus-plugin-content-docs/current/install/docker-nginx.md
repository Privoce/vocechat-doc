---
sidebar_position: 3
title: Docker + Nginx 安装
description: Nginx + Certbot 配置比较复杂，需要一些耐心。
---
# 前言
基本原理：Nginx 监听在 443 端口，证书配置在 Nginx + certbot，Nginx 收到 HTTPS 请求后转发给 `vocechat-server:3000`。
```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │  Nginx  │        │         │
│ Client  ├─────────────────►│    CA   ├──────► │ vocechat│
│         │                  │   443   │        │   3000  │
└─────────┘                  └─────────┘        └─────────┘
```

# 1. 安装运行 vocechat-server
让 vocechat-server 监听在 3000 端口。
```shell
mkdir data
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  -v ./data:/home/vocechat-server/data \
  privoce/vocechat-server:latest \
  --network.frontend_url "https://domain.com"
```

:::tip
- `-v ./data:/home/vocechat-server/data` 将容器内部的数据目录映射出来
- `network.frontend_url` 改为您的域名
:::

# 2. 安装配置 Nginx & CertBot

### 2.1 安装
```shell
apt update
apt install nginx certbot python3-certbot-nginx -y
```

### 2.3 配置 Nginx
新建配置文件(将 domain.com 替换为您的域名)
```shell
cat > /etc/nginx/sites-available/domain.com << EOF
server {
    server_name domain.com;
    listen 80;
    listen [::]:80;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# 启用配置
ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/

# 测试
nginx -t

# 重启
systemctl restart nginx

```

### 申请 & 安装证书
```shell
# 生成证书，自动修改 nginx 配置文件
certbot --nginx -d domain.com --register-unsafely-without-email

# 测试新的配置
nginx -t

# 重启 nginx
systemctl restart nginx
```

浏览器访问 https://domain.com/