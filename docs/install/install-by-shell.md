---
sidebar_position: 3
---

:::tip

- VoceChat works well for devices like Raspberry Pi, NAS, use shell to install is good for geeks who want to maximize performance。
- You will run the compiled binary code on your machine, now support Linux x86_64, Arm32, Aarch64.
- Make sure you have this directory: /etc/init.d and you have write permission.
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

#### 5. Upgrade

```bash
curl -sSf https://s.voce.chat/update.sh | sh
```

if you need help, contact: han@privoce.com
