---
sidebar_position: 3
title: Run in Docker + Nginx
description: Nginx + Certbot configuration is complex and requires some patience.
---
# Foreword
Basic principle: Nginx listens on port 443, the certificate is configured on Nginx Certbot, and Nginx forwards HTTPS requests to 'voice chat server: 3000'.
```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │  Nginx  │        │         │
│ Client  ├─────────────────►│    CA   ├──────► │ vocechat│
│         │                  │   443   │        │   3000  │
└─────────┘                  └─────────┘        └─────────┘
```

# 1. Run vocechat-server
Let the voice chat server listen on port 3000.
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
- `-v ./data:/home/vocechat-server/data` Map the data directory inside the container
- `network.frontend_url` change to your domain
:::

# 2. Install & Config Nginx & CertBot

### 2.1 Install
```shell
apt update
apt install nginx certbot python3-certbot-nginx -y
```

### 2.3 Config Nginx
Create a new configuration file (replace domain.com with your domain name)
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

# Enable config
ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/

# Test
nginx -t

# Restart
systemctl restart nginx

```

### Sign & Apply Certificate
```shell
# Generate certificates and automatically modify nginx configuration files
certbot --nginx -d domain.com --register-unsafely-without-email

# Test new config of Nginx after certbot modified.
nginx -t

# Restart nginx
systemctl restart nginx
```

Browser access: https://domain.com/