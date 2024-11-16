---
sidebar_position: 2
title: Docker + Caddy 安装
description: Caddy 比 Nginx 更加的简洁，推荐使用。
---

# 与 Caddy 配合使用
Caddy 相比 Nginx 更加的简洁，它可以自动申请证书，推荐使用。
需要先启动 vocechat-server，再安装配置 Caddy, 否则证书可能会申请失败。

### 1. 启动 vocechat-server
```shell
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```

### 2. 查看 vocechat-server 状态
```shell
docker ps -a
docker logs -f vocechat-server

# 进入 docker 内部查看配置文件
docker exec -it vocechat-server /bin/sh
cat config/config.toml
```

### 3. 安装 Caddy 前的准备工作
一点点检查工作:
```shell
# 检查端口是否被占用，如果被占用，停掉它。
netstat -nlpt|grep 80
netstat -nlpt|grep 443

# 检查域名是否已经解析到位
ping domain.com
```

### 4. 安装 Caddy
```shell
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
curl -fsSL 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
apt update
apt install caddy
```
### 2. 配置 Caddy
```bash
cat > /etc/caddy/Caddyfile << EOF
domain.com:443 {
    tls {
        protocols tls1.2 tls1.3
    }
    reverse_proxy /* localhost:3000
}
EOF
```
重启 caddy
```shell
systemctl stop caddy
systemctl start caddy
```
查看日志
```shell
journalctl -u caddy -f
```
浏览器访问：https://domain.com/ 按照页面引导完成安装。

### 5. 查看 Caddy 状态
在服务端：
```shell
# 查看 80 443 端口是否已经打开
netstat -nlpt
```

在本机：
```shell
# 确认域名指向正确
ping domain.com

nc -vv domain.com 80
nc -vv domain.com 443

# 测试端口是否正常提供服务
curl http://domain.com/ 80
curl https://domain.com/ 443
```