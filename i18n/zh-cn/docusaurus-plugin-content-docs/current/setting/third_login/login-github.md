---
title: Github 登录
---

# 设置 Github 登录

:::tip 设置前提
需要有 GitHub 账号
:::

## 登录 [Github](https://github.com)

## 创建 GitHub OAuth 应用

访问：[https://github.com/settings/applications/new](https://github.com/settings/applications/new)

![img.jpg](image/login-github-0.png)

:::tip
最关键的是回调地址一定要填写正确：`https://vocechat.yourdomain.com/github/cb`，只需将域名换为自己部署成功的 VoceChat 域名，其它不用改。
:::

## 获得 ClientID, Client Secret

![img.jpg](image/login-github-1.jpg)

## 将 ClientID, Client Secret 填入 VoceChat 后台

![img.jpg](image/login-github-2.jpg)
