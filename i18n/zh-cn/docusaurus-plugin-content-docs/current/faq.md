---
sidebar_position: 99
title: 常见问题
---

## VoceChat是完全免费吗？

目前VoceChat的使用是完全免费的，只是有用户数量限制：**20人**。一般的个人用户完全够用，如需提高人数限制，请自行购买升级证书，或者[联系我们](/contact)，申请免费升级。

## VoceChat有后门吗？

VoceChat是一个完全由用户自部署使用的产品，部署成功，除了升级证书，其它所有使用均在自部署的服务器上完成，没有后门，包括我们都不知道您已部署成功的实例地址。后期，我们会将后端开源，进一步接受监督。

## 一直收不到消息推送

目前VoceChat的消息推送需借助Google相关服务，所以，由于众所周知的原因，请确认您部署的服务器是否在中国大陆。

## 文件消息（包括图片）的发送，涉及哪些API，如何完成消息发送？{#file_msg}

与文本消息不同，VoceChat发送文件消息，包括机器人场景，需要多个API配合完成，在此按照使用顺序介绍下：

:::tip 注意
下面提到的API均可在已部署的[swagger文档](/api-doc)中找到，另，涉及的API均有登录校验，即需要通过header：`x-api-key`将登录token带过去，下面不再赘述。
:::

### 第一步：准备工作

此时用到的API：`/api/resource/file/prepare`**(如果是机器人，API：`/api/bot/file/prepare`)**。
调用该API的目的是告诉后端要上传文件了，POST过去两个信息：
- `content_type`：文件类型，值和http里的header：`content-type`一致，具体请参考：[MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- `filename`：文件名，带扩展名的文件名，比如：file.txt,abc.png

该API会响应一个随机字符串，即`file_id`，用于后续的API。

### 第二步：上传文件
此时用到的API：`/api/resource/file/upload`**(如果是机器人，API：`/api/bot/file/upload`)**。
该API默认是分片上传文件，客户端需自行完成文件分片事宜（大小需根据自己的网络服务器配置而定，建议分片大小设置为200KB）。所以根据文件大小，很可能会多次循环调用，每次需要POST过去三个信息：

- `file_id`：即第一步拿到的`file_id`
- `chunk_data`：该次循环的文件分片
- `chunk_is_last`：是否是最后一个分片

:::tip 注意
文件分片不是强制的，也可以一次性上传：`chunk_data` 设为整个文件内容， `chunk_is_last` 为 `true`，相当于一次性上传文件。
:::

最后一个分片上传完，拿到API的响应：
``` json
{
  "path": "string",
  "size": number,
  "hash": "string",
  "image_properties": {
    "width": number,
    "height": number
  }
}
```
:::tip 注意
如果是图片，会有`image_properties`相关信息
:::
此时，我们主要用到的字段是：`path`，用于后续的API

### 第三步：发送消息

此时用到的API取决于发消息的上下文：频道或者私聊。不过不同上下文只是path路径不同，传参和响应格式是一样的，所以我们此处仅使用发送私聊消息举例：

用到的API：`/api/user/{uid}/send`。使用方式：
- 设置header：`content-type:vocechat/file`
- API 路径里的`uid`即为正在私聊的用户id
- POST内容
  ``` json
  {
    "path": "string"
  }
  ```
  此处的`path`即为第二步拿到的`path`

## 部署成功了，也完成了初始化，但是界面显示一直加载中 {#loading_after_deployed}

请确认您的API有没有使用CDN，如果有，请去除，或者针对`/api`路径做排除。
