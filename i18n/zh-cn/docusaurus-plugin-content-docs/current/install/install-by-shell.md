---
sidebar_position: 3
title: Shell 脚本安装
description: 适用于小型设备（比如树莓派、NAS设备），或者想最大化性能
---

:::tip

- 该安装方式适用于小型设备（比如树莓派、NAS 等设备），或者想最大化性能的极客。
- 基本原理是直接运行二进制的方式，目前支持 Linux x86_64, Arm32, Aarch64 架构。

:::

## 安装

在安装的过程中，会询问绑定的端口，域名，和是否启用 TLS（会自动申请证书）。
这里要注意的是，如果你要开启 TLS，那么端口必须为 443，也就意味着你的 `vocechat-server` 必须独占 443。

```bash
curl -sSf https://s.voce.chat/install.sh | sh
```

## 启动

```bash
/etc/init.d/vocechat-server.sh start
```

## 停止

```bash
/etc/init.d/vocechat-server.sh stop
```

## 查看日志

```bash
/etc/init.d/vocechat-server.sh log
```
