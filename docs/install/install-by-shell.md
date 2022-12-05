---
sidebar_position: 3
---

:::tip

- 该安装方式适用于小型设备（比如树莓派、NAS 等设备），或者想最大化性能的极客。
- 基本原理是直接运行二进制的方式，目前支持 Linux x86_64, Arm32, Aarch64 架构。
- 确保您的系统目录 /etc/init.d 存在，并且可写。
  :::

# Deploy through Shell

If you want to run our binary program directly, you can use this method. Now we support Linux x86\_ 64, arm32, aarch64 architecture.
In the previous page, we introduced installing vocechat through docker. Generally, most users scenarios can be satisfied through docker deployment, yet if you want to work on small devices (such as RaspBerry Pi, NAS, etc.) or want to maximize performance, you may want to consider this method.

#### 1. Install

During the installation process, the bound port, domain name and whether TLS is enabled will be asked (the certificate will be applied automatically).

```bash
curl -sSf https://s.voce.chat/install.sh | sh
```

#### 2. Start

```bash
/etc/init.d/vocechat-server.sh start
```

#### 3. Stop

```bash
/etc/init.d/vocechat-server.sh stop
```

#### 4. Log

```bash
/etc/init.d/vocechat-server.sh log
```

if you need help, contact: han@privoce.com
