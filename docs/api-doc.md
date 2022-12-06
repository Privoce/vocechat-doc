---
sidebar_position: 3.1
title: API (Swagger)
---

:::tip
VoceChat server has an open API--you can build your own chat based on these APIs:)
:::

Address：`https://vocechat.yourdomain.com/api/swagger` (Switch to your own server URL):

## 1st step: switch to your own server

![step 1](image/api.step1.png)

## 2nd step: Fill in your token

:::tip
Token has an expiration time (this token here is the same as the JSON-web token)! Get the newest token through checking the API head: `X-API-Key` (see image below).
:::
![api token](image/api.token.png)
Fill in this token to hte swagger popup, and then start using the API!
:::tip
Some APIs need admin token to use (check your roles inside the app).
:::
![step 2](image/api.step2.jpg)

## Also：every API has a "Try it Out" for you to use right at the swagger page.

![step last](image/api.step.last.png)
