---
sidebar_position: 1
title: Docker 安装 [推荐]
---

# Docker 部署 vocechat

## 本地快速体验

示意图 & 命令:

```
┌─────────┐                  ┌─────────┐
│         │                  │         │
│  Client ├─────────────────►│ vocechat│
│         │                  │   3000  │
└─────────┘                  └─────────┘
```

```shell
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```

浏览器访问: http://localhost:3000/

> 如果是服务器端，将`localhost`替换为自己的公网 IP 地址

## 服务器全功能部署

> 如果你的服务器没有被其它服务占用 https 端口（即 443），可以考虑该方式，否则，请参考 [Docker & Nginx 安装](/install/install-by-docker-nginx) 中的 https 部分

vocechat-server 支持自动申请 https 证书（借助[CertBot](https://certbot.eff.org/pages/about)），使用该部署方式有两个前提：

- 服务器 443 端口没有被占用
- 准备一个域名，并已解析到该服务器 IP。

示意图 & 命令:

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
  privoce/vocechat-server:latest \
  --network.bind "0.0.0.0:443" \
  --network.domain "vocechat.yourdomain.com" \
  --network.tls.type "acme_tls_alpn_01" \
  --network.tls.acme.cache_path "/home/vocechat-server/data/cert"
```

参数说明:

- `network.bind:` 服务端绑定的 IP 和端口，`0.0.0.0` 为所有 IP
- `network.domain:` 域名
- `network.type:` TLS 验证方式，这里为 `acme_tls_alpn_01`，更多请参考代码目录 `config/config.toml` 。
- `network.tls.acme.cache_path:` 证书存放位置。
- `network.tls.acme.directory_url:` 默认的验证机构，可选，默认 `https://acme-v02.api.letsencrypt.org/directory`。

访问:`https://vocechat.yourdomain.com/`，完成初始化 。

如果 80/443 端口被 Nginx 占用, 请参考 [Nginx 反向代理](install-by-docker-nginx.md)

## 其他相关命令

### 停止服务

```bash
docker stop vocechat-server
```

### 查看日志

```bash
docker logs -f vocechat-server
```

### 备份数据

```bash
cp -rf ~/.vocechat-server/data ~/.vocechat-server/backup
```

### 更新 Docker:

```shell
docker stop vocechat-server
docker rm vocechat-server
docker pull privoce/vocechat-server:latest

# 这里改为自己的
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest

```

### 进入 Docker 内部

```shell
docker exec -it vocechat-server /bin/sh
cd /home/vocechat-server/data
```

## 使用 widget 扩展聊天场景

部署成功 vocechat，并且已完成初始化工作，可以很方便地借助 widget，把聊天场景拓展到任意网站。具体请参看 [使用挂件（widget）](/widget)

如需要帮助，请在官网联系我们：[https://voce.chat](https://voce.chat) ，如需合作请 email 联系 **han@privoce.com**
