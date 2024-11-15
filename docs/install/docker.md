---
sidebar_position: 1
title: Run in Docker
description: Docker can be quickly deployed, and it is recommended.
---

:::warning Important!
System architecture：the default platform is for `linux/amd64`, if you are `linux/arm64`, please pull `privoce/vocechat-server:latest-arm64`
:::

## 1. Quck start
Install Docker as quickly as possible and set up the environment:
```shell
# Install Docker
apt update
apt install -y curl
curl -fsSL https://get.docker.com | bash
systemctl start docker
systemctl enable docker

# close & config system firewall
ufw disable
systemctl stop iptables
systemctl stop nftables
```
One line startup service:
```shell
# run container
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```
Browser access: `http://domain.com:3000/`

## 2. Enable domain + TLS
vocechat-server integrates WebServer, CertBot, can automatically apply for free certificates.
In this situation, vocechat-server exclusive port 443.
If you need to share port 443 with other services, please refer to other documentation.
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
Browser access: `https://domain.com/`

## 3. Other Command

### 3.1 Stop service

```bash
docker stop vocechat-server
```

### 3.2 View logs

```bash
docker logs -f vocechat-server
```

### 3.3 Backup

```bash
cp -rf ~/.vocechat-server/data ~/.vocechat-server/backup
```

### 3.4 Upgrade vocechat-server（update docker image）{#upgrade}

```shell
docker stop vocechat-server
docker rm vocechat-server
docker pull privoce/vocechat-server:latest

# Change here to the Docker command line that you previously deployed and executed
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```

### 3.5 into Docker container

```shell
docker exec -it vocechat-server /bin/sh
cat config/config.toml
```

## 4. Use mobile APP or popup chat widget

After having vocechat on your server, feel free to use our mobile APP with your friends or collegues：[Use VoceChat APP](/mobile-app). Also, a popup widget is available to get embeded on any website for visitors to chat with the admin of the vocechat server [Use Chat Widget](/widget)

:::tip
If you still need help, feel free to chat with us on our official website: [voce.chat](https://voce.chat), if you want to collaborate with us, send an email to: **han@privoce.com**
:::
