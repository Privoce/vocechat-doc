---
sidebar_position: 1
title: Docker 安装
---

# Docker 部署 vocechat

支持 x86 Docker，ARM 平台请直接运行二进制。

## 1. 快速体验: HTTP 方式

快速的体验的方式。 示意图 & 命令:

```
┌─────────┐                  ┌─────────┐
│         │                  │         │
│  Client ├─────────────────►│ vocechat│
│         │                  │   3000  │
└─────────┘                  └─────────┘
```

```bash
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  vocechat/vocechat-server:latest
```

访问: http://localhost:3000/  
默认账号密码：admin@vocechat.com / 123456

## 2. HTTPS 方式，自动申请证书

vocechat-server 支持自动申请证书，这种模式需要 443 端口没有被占用，并且有域名指向了该服务器 IP。 示意图 & 命令:

```
┌─────────┐                  ┌─────────┐
│         │                  │         │
│  Client ├─────────────────►│ vocechat│
│         │                  │   443   │
└─────────┘                  └─────────┘
```

```bash
mkdir -p ~/.vocechat-server/data
docker run -d --restart=always \
  -p 443:443 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  vocechat/vocechat-server:latest \
  --network.bind "0.0.0.0:443" \
  --network.domain "www.domain.com" \
  --network.tls.type "acme_tls_alpn_01" \
  --network.tls.acme.cache_path "/home/vocechat-server/data/cert"
```

参数说明:  
network.bind: 服务端绑定的 IP 和端口，0.0.0.0 为所有 IP  
<font color="#dd0000">**network.domain:** 域名 </font>  
network.type: TLS 验证方式，这里为 acme_tls_alpn_01，更多请参考 config/config.toml 。  
network.tls.acme.cache_path: 证书存放位置。  
network.tls.acme.directory_url: 默认的验证机构，默认 "https://acme-v02.api.letsencrypt.org/directory"。  
访问:https://www.domain.com/ 。  
默认账号密码：admin@vocechat.com / 123456

如果 80/443 端口被 Nginx 占用, 请参考 [Nginx 反向代理](install-by-docker-nginx.md)

## 3 其他相关命令

### 3.1 停止服务

```bash
docker stop vocechat-server
```

### 3.2 查看日志

```bash
docker logs -f vocechat-server
```

### 3.3 备份数据

```bash
cp -rf ~/.vocechat-server/data ~/.vocechat-server/backup
```

### 3.4 更新 Docker:

```shell
docker stop vocechat-server
docker rm vocechat-server
docker pull vocechat/vocechat-server:latest

# 这里改为自己的
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  vocechat/vocechat-server:latest

```

### 3.5 进入 Docker 内部

```shell
docker exec -it vocechat-server /bin/sh
cd /home/vocechat-server/data
```
如需要帮助，请在主页社区联系我们：[https://voce.chat](https://voce.chat) ，如需合作请email联系han@privoce.com
