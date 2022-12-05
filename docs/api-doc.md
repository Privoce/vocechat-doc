---
sidebar_position: 3.1
title: API文档
---

:::tip
我们有详尽的 API 文档说明，你可以基于该文档，构建自己的客户端聊天工具。
:::

访问地址：`https://vocechat.yourdomain.com/api/swagger` (此处请替换为自己的域名)。使用方式：

## 第一步：切换到自己的 Server

![step 1](image/api.step1.png)

## 第二步：填入已登录的 Token

:::tip
Token 值本质是 JWT 中的 Token，所以有时长限制，如在使用时过期，请重新获取。获取方式可通过业务 API 请求头`X-API-Key`拿到(见下图).
:::
![api token](image/api.token.png)
将获取到的 token 填入 swagger 认证弹窗内，之后就可以调试所有 API 了。
:::tip
注意所使用的账号角色，有些 API 需要管理员角色才能调试。
:::
![step 2](image/api.step2.jpg)

## 最后：每个 API 都有 Try it Out 选项，可以由此调试该 API

![step last](image/api.step.last.png)
