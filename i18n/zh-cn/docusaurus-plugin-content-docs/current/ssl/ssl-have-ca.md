---
sidebar_position: 1
title: 自有证书
---

# 我的域名已经有了申请证书

在前面的章节 [Docker](/install/install-by-docker) 和 [Shell](/install/install-by-shell) 里，已经包含了如何让 `vocechat-server` 自动申请证书。
所以，正常情况下，您无需阅读此章节，如果您已经有了自己的证书，那么可以通过以下配置来实现。

### 1. 你需要有一个域名，假定为 domain.com，并且已经指向了服务器外网 IP。

### 2. 配置 config/config.toml

```shell
[network]
bind = "0.0.0.0:443" # 这里必须为 443
domain = "domain.com" # 修改为自己的域名

[network.tls]
type = "certificate"
cert = """....""" # 证书内容直接复制到这里
key = """...."""  # 私钥直接复制到这里
```

### 3. 启动 vocechat-server

```shell
vocechat-server config/config.toml
```

服务启动以后，会有证书申请，加载的提示。注意 vocechat-server 本身就是一个高性能 HTTP Server，不需要安装配置 nginx。如果 443 端口被占用，你应该停止相关的服务，让 vocechat-server 独占 443 端口。
