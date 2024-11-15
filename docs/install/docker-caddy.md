---
sidebar_position: 2
title: Run in Docker + Caddy
description: Caddy is more simple than Nginx and is recommended for use.
---

# Work with Caddy
Caddy is more simple than Nginx, as it can automatically apply for certificates. It is recommended to use it.

### 1. Preparation
A little inspection work:
```shell
# Check if the port is occupied, and if so, stop it.
netstat -nlpt|grep 80
netstat -nlpt|grep 443

# Check if the domain name has been resolved properly
ping domain.com
```

### 2. Install Caddy
```shell
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
```
### 2. Config Caddy
vim /etc/caddy/Caddyfile
```bash
domain.com:443 {
    tls {
        protocols tls1.2 tls1.3
    }
    reverse_proxy /* localhost:3000
}
```
Restart caddy
```shell
systemctl stop caddy
systemctl start caddy
```
View logs
```shell
journalctl -u caddy -f
```

### 3. Start vocechat-server
```shell
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```

### 4. View status of vocechat-server
```shell
docker ps -a
docker logs -f vocechat-server

# Into docker to view config
docker exec -it vocechat-server /bin/sh
cat config/config.toml
```

### 5. View status of Caddy
in server：
```shell
# Check if port 80 443 is already open
netstat -nlpt
```

In local：
```shell
# Confirm that the domain name points to the correct location
ping domain.com

nc -vv domain.com 80
nc -vv domain.com 443

# Test whether the port is providing services normally
curl http://domain.com/ 80
curl https://domain.com/ 443
```