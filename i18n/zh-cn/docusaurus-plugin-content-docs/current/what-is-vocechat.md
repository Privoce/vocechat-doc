---
sidebar_position: 1
slug: /
title: 简介
---

# VoceChat 简介

`VoceChat` 是一款支持独立部署的个人云社交媒体聊天服务。15MB 的大小可部署在任何的服务器上，部署简单，很少需要维护。前端可以内嵌到自己的网站下，数据完全由用户自己掌握，传输过程加密。VoceChat 从 `Slack`, `Discord`, `RocketChat`, `Solid`, `Matrix` 等产品和规范中博采众长，适用于团队内部交流，个人聊天服务，网站客服，网站内嵌社区的场景。

我们认为 Web 3.0 去中心化的第一步是基于个人云的去平台化，通过个性化的计算与个性化的存储，让个人和组织拥有自己的平台，所以 VoceChat 的定位是能轻易部署在私有云上的社交协作程序。

团队国际化，远程合作，贡献者来自中、美、巴西等地区, VoceChat 是一个开放的、赋能用户的产品，欢迎大家点 star 关注，提 issues，或者以其他形式参与贡献。

### 项目组成：

| 名称     | 技术    | 项目                                                          | License    | 说明                                                                 |
| -------- | ------- | ------------------------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| 服务端:  | Rust    | vocechat-server(暂未开源)                                     | 待定       | 聊天服务端，支持主流平台: Linux x86_64, Windows 32/64, Arm32, Arch64 |
| 客户端:  | Flutter | [vocechat-client](https://github.com/privoce/vocechat-client) | Apache-2.0 | 聊天客户端，支持 Android, iOS 平台的客户端                           |
| Web:     | React   | [vocechat-web](https://github.com/privoce/vocechat-web)       | GPL-3.0    | 聊天功能的浏览器版本，整合了管理                                     |
| Web-SDK: | React   | vocechat-web-sdk(暂未开源)                                    | GPL-3.0    | 可以整合到其他 Web 产品中，使其赋能聊天功能                          |

### 功能列表 & 计划

- [x] 群聊、私聊 / 2021-Q4
- [x] 引用, at / 2021-Q4
- [x] 图片、大文件传输 / 2021-Q4
- [x] 置顶 / 2022-Q1
- [x] 转发 / 2022-Q1
- [x] 收藏 / 2022-Q1
- [x] 阅后即焚（高级功能） / 2022-Q1
- [x] 语音（高级功能）/ 2022-Q4
- [x] 视频（高级功能）/ 2022-Q4

### 联系我们

- Github: [https://github.com/privoce](https://github.com/privoce)
- Email: **han@privoce.com**
