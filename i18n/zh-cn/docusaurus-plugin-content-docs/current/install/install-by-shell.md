---
sidebar_position: 3
title: shell 安装
---

# Shell 部署

直接运行二进制的方式，目前支持 Linux x86_64, Arm32, Aarch64 架构。  
一般情况通过 Docker 部署就能满足普通需求，如果希望工作在小型设备（比如树莓派、NAS 等设备），或者想获得最大化性能，可以考虑这种方式。

#### 1. 安装

在安装的过程中，会询问绑定的端口，域名，和是否启用 TLS（会自动申请证书）。
这里要注意的是，如果你要开启 TLS，那么端口必须为 443，也就意味着你的 vocechat-server 必须独占 443。

```bash
curl -sSf https://sh.vocechat.com/install.sh | sh
```

#### 2. 启动

```bash
/etc/init.d/vocechat-server.sh start
```

#### 3. 停止

```bash
/etc/init.d/vocechat-server.sh stop
```

#### 4. 查看日志

```bash
/etc/init.d/vocechat-server.sh log
```
