---
sidebar_position: 3.4
title: OpenClaw 接入
---

# 通过插件将 VoceChat 接入 OpenClaw

## 这个插件已经实现了什么

当前这个 VoceChat 插件已经实现了核心接入链路：

- 接收 VoceChat webhook 入站消息
- 将消息路由进 OpenClaw
- 将 OpenClaw 回复发回 VoceChat
- 支持文本消息发送
- 支持 reply 发送
- 支持文件上传和附件发送
- 暴露 `GET /` 健康检查接口

换句话说，VoceChat 可以直接作为 OpenClaw 的聊天前端使用。

## 整体架构

```text
VoceChat 用户 / 群组
          |
          v
VoceChat Bot Webhook（HTTP POST /）
          |
          v
OpenClaw Gateway + VoceChat Plugin
          |
          v
OpenClaw Agent Runtime
          |
          v
VoceChat Bot API
```

## 前置条件

开始前，请确认你已经准备好：

- 一个可用的 **VoceChat** 服务
- 一个可用的 **OpenClaw** 部署
- 本地可加载的 VoceChat 插件源码或插件包
- 一个 VoceChat Bot 以及对应 API Key
- 一个能让 VoceChat 访问到 OpenClaw webhook 端口的公网地址

## 快速上手

如果你已经搭建好Openclaw，可以直接将本页地址发送给他，让他帮忙配置和指导操作

## 第一步：在 VoceChat 中创建 Bot

进入：

`Settings => Bot&Webhook`

创建一个给 OpenClaw 使用的 Bot，例如：

- Bot Name: `OpenClaw`
- Webhook URL: 先留空

然后为这个 Bot 创建并保存 **API Key**。

至少要记录这两项：

- **VoceChat 服务地址**
- **Bot API Key**

## 第二步：在 OpenClaw 中加载 VoceChat 插件

在 OpenClaw 配置中启用本地插件。

示例：

```json
{
  "plugins": {
    "allow": ["vocechat"],
    "load": {
      "paths": [
        "/root/.openclaw/workspace/vocechat"
      ]
    },
    "entries": {
      "vocechat": {
        "enabled": true
      }
    }
  }
}
```

这段配置的作用是告诉 OpenClaw：从本地路径加载 `vocechat` 这个 channel plugin。

## 第三步：配置 `channels.vocechat`

在 `openclaw.json` 里增加 `channels.vocechat` 配置。

示例：

```json
{
  "channels": {
    "vocechat": {
      "enabled": true,
      "serverUrl": "https://your-vocechat.example.com",
      "apiKey": "YOUR_BOT_API_KEY",
      "webhookHost": "0.0.0.0",
      "webhookPort": 8010
    }
  }
}
```

字段说明：

- `serverUrl`：VoceChat 服务根地址
- `apiKey`：VoceChat Bot API Key
- `webhookHost`：Webhook 监听地址，通常是 `0.0.0.0`
- `webhookPort`：Webhook 监听端口，默认是 `8010`

这个插件支持顶层默认账号配置，如果你有需要，也支持放在 `channels.vocechat.accounts` 下面配置多个账号。

## 第四步：确保 OpenClaw 具备足够工具权限

插件仓库文档里建议显式补齐 OpenClaw 的工具权限。

示例：

```json
{
  "tools": {
    "profile": "full",
    "allow": ["*"],
    "exec": {
      "host": "gateway",
      "security": "full",
      "ask": "off"
    }
  }
}
```

如果权限不够，某些运行时行为可能会不完整。

## 第五步：暴露 webhook 端口

这个插件会在 OpenClaw 内启动一个 HTTP webhook 服务。

默认行为是：

- `GET /` → 返回 `200 ok`
- `POST /` → 接收 VoceChat webhook payload

默认监听地址：

```text
0.0.0.0:8010
```

如果你使用 Docker 或 Docker Compose，请记得暴露 `8010` 端口。

示例：

```yaml
ports:
  - "18789:18789"
  - "8010:8010"
```

## 第六步：把 VoceChat webhook 指向 OpenClaw

OpenClaw 启动并加载插件后，回到 VoceChat 的 Bot 配置页面，把 webhook URL 设置成 OpenClaw 暴露出来的地址。

例如：

```text
http://YOUR_OPENCLAW_HOST:8010/
```

VoceChat 会校验 webhook 地址，而这个插件已经内置了 `GET /` 健康检查，所以可以直接用于验证。

## 第七步：重启 OpenClaw Gateway

修改配置后，重启 gateway。

常用命令：

```bash
openclaw gateway status
openclaw gateway restart
```

如果你是通过 Docker Compose 跑 OpenClaw，也可以在那里重启对应容器。

## 入站消息是如何处理的

插件通过 `POST /` 接收 VoceChat 事件。

它已经帮你完成了基础入站链路：

- 解析 webhook JSON
- 判断当前是私聊还是群聊
- 提取消息内容
- 忽略不支持的 edit / delete 事件
- 把消息路由进 OpenClaw
- 记录入站 session
- 把 OpenClaw 回复回发到 VoceChat

插件内部使用的目标格式是：

- `vocechat:private:<uid>`
- `vocechat:group:<gid>`

## 当前支持能力

目前已经实现：

- 私聊
- 群聊
- 文本回复
- reply 发送
- 媒体 / 文件出站上传
- 基础健康检查
- 基于 Bot API 的状态探测

## 验证清单

配置完成后，建议按下面清单验证：

1. `GET http://YOUR_OPENCLAW_HOST:8010/` 返回 `ok`
2. VoceChat 能成功保存 webhook URL
3. 私聊 Bot 的消息能进入 OpenClaw
4. OpenClaw 的回复能回到同一个会话
5. 如果测试群聊，Bot 能正常在群里发言

## 排查问题

### VoceChat 里保存不了 webhook

检查：

- OpenClaw 地址是否能被 VoceChat 访问到
- webhook URL 的 `GET /` 是否返回 `200`
- `8010` 端口是否已经暴露
- 反向代理是否把请求正确转发到了 OpenClaw webhook 端口

### OpenClaw 完全收不到消息

检查：

- `plugins` 中是否允许并启用了 `vocechat`
- 插件路径是否正确
- `channels.vocechat.enabled` 是否为 `true`
- 修改配置后是否重启了 gateway

### OpenClaw 收到消息但回不去

检查：

- `serverUrl` 是否正确
- `apiKey` 是否有效
- Bot 是否仍然有权限向目标私聊或群组发消息
- 如果测试群聊，Bot 是否已经先被加入了那个群组

### 插件回到了错误的会话

检查：

- 入站事件目标到底是私聊还是群聊
- 当前使用的是否是你预期的 Bot 账号
- 如果配置了多个 VoceChat 账号，路由是否指向了正确账号

## 相关实现细节

这个插件在 OpenClaw 里注册的 channel id 是 `vocechat`。

一些关键实现点：

- plugin id：`vocechat`
- 入站 webhook：`GET /` 和 `POST /`
- 默认 webhook 端口：`8010`
- 出站目标格式：
  - `vocechat:private:<uid>`
  - `vocechat:group:<gid>`

## 相关文档

- [Bot and Webhook](/bot/bot-and-webhook)
- [API Doc](/api-doc)
