---
sidebar_position: 2
title: 无证书
---

# 没有申请证书

在前面的章节 [Docker](/install/install-by-docker) 和 [Shell](/install/install-by-shell) 里，已经包含了如何让 vocechat-server 自动申请证书。所以，正常情况下，您无需阅读此章节。

vocechat-server 支持自定义证书，也支持自动申请证书。

## 1. 准备工作

### 1.1 准备一个域名

将域名 A 记录指向该服务器 IP。

### 1.2. 确定 443 端口没有被占用

您可以通过以下命令来确定端口是否被占用:

```shell
netstat -nlpt|grep 443
```

## 2. 修改配置

修改 config/config.toml，vocechat-server 默认 bind 3000，这里改为 443

### 2.1 自定义证书

如果您已经申请了证书，将证书的内容复制粘贴进去。

```shell
[network]
bind = "0.0.0.0:443"
domain = "www.domain.com"

[network.tls]
type = "certificate"
cert = """multi lines"""
key = """multi lines"""
```

### 2.2. 自动申请和续签证书

服务端自动申请证书和续签证书，建议这种方式。

```shell
[network]
bind = "0.0.0.0:443"
domain = "www.domain.com"

[network.tls]
type = "acme_tls_alpn_01"
cache_path = "data/cert"
```

### 2.3 自签名证书

自签名证书，浏览器端会提示风险，客户端可以正常使用。

```shell
[network]
bind = "0.0.0.0:443"
domain = "www.domain.com"

[network.tls]
type = "self_signed"
```

# 3. 重启 vocechat-server

```shell
docker restart vocechat-server
# 或者
/etc/init.d/vocechat-server.sh restart
```

# 4. 验证

访问 https://www.domain.com/
