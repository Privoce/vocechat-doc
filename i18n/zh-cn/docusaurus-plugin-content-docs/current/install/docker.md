---
sidebar_position: 1
title: Docker 安装
description: 使用 Docker 可以快速的布署，测试环境建议使用。
---

:::warning 重要提示
请确认你的系统架构：默认安装 `linux/amd64`，如果是 `linux/arm64`，请拉取`privoce/vocechat-server:latest-arm64`
:::

## 1. 快速体验
最快速度安装 docker, 并搞定环境:
```shell
# 安装 Docker
apt update
apt install -y curl
curl -fsSL https://get.docker.com | bash
systemctl start docker
systemctl enable docker

# 关闭 & 配置防火墙
ufw disable
systemctl stop iptables
systemctl stop nftables
```
一行启动服务:
```shell
# 运行容器
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```
浏览器访问: `http://domain.com:3000/`

## 2. 启用域名 + TLS
vocechat-server 内置了 WebServer, 集成了 CertBot, 可以自动申请免费证书。  
这种情况 vocechat-server 独占服务器 443 端口。  
如果你需要和其他服务共享 443 端口，请参考其他文档。
```shell
mkdir data
docker run -d --restart=always \
  -p 443:443 \
  --name vocechat-server \
  -v ./data:/home/vocechat-server/data \
  privoce/vocechat-server:latest \
  --network.bind "0.0.0.0:443" \
  --network.domain "domain.com" \
  --network.tls.type "acme_tls_alpn_01" \
  --network.tls.acme.cache_path "/home/vocechat-server/data/cert"
```
浏览器访问: `https://domain.com/`

## 3. 其他相关命令

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

### 3.4 升级server版本（更新docker镜像）{#upgrade}

```shell
docker stop vocechat-server
docker rm vocechat-server
docker pull privoce/vocechat-server:latest

# 这里改为自己之前部署执行过的docker命令行
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```

### 3.5 进入 Docker 内部

```shell
docker exec -it vocechat-server /bin/sh
cat config/config.toml
```

## 4. 移动 APP 与挂件

部署成功 vocechat，并且已完成初始化工作，可以继续安装使用我们的移动 APP，具体使用请移步：[使用 VoceChat APP](/mobile-app)；还可以很方便地借助挂件，把聊天场景拓展到任意网站。具体请参看 [使用挂件](/widget)

:::tip
如需要帮助，请在官网联系我们：[voce.chat](https://voce.chat) ，如需合作请 email: **han@privoce.com**
:::
