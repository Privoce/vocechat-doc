---
sidebar_position: 6
title: 如何备份
---

# 如何备份？

备份 vocechat-server 只需要停止服务后，拷贝 data 目录。

1. 停止服务:

```shell
docker stop vocechat-server
```

2. 备份数据：

```shell
cp -rf ~/.vocechat-server/data /backup/
```

3. 启动服务:

```shell
docker start vocechat-server
```

# 如何迁移？

假定旧的服务器为 old-server, 新的服务器为 new-server，彼此做好了 ssh 信任，安装了 rsync。

### 1. 在 new-server 上安装一个全新版本 vocechat-server

docker 启动参数调整为合适自己的参数。

```shell
mkdir -p ~/.vocechat-server/data
docker run -d --restart=always \
  -p 443:443 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  privoce/vocechat-server:latest \
  --network.bind "0.0.0.0:443" \
  --network.domain "www.domain.com" \
  --network.tls.type "acme_tls_alpn_01" \
  --network.tls.acme.cache_path "/home/vocechat-server/data/cert"
```

### 2. 停止 new-server 的 vocechat-server

```shell
docker stop vocechat-server
```

### 3. 将数据从 old-server 上拷贝到 new-server

```shell
cd ~/.vocechat-server/
rsync -av root@old-server:/root/.vocechat-server/* ./
```

### 4. 启动 new-server 的 vocechat-server

```shell
docker start vocechat-server
```
