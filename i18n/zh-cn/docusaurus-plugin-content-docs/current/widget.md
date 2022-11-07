---
sidebar_position: 4
slug: /widget
title: 使用挂件（widget）
---

以部署实例域名为`https://vocechat.yourdoamin.com`为例:

```html
<!-- put this code snippet into your html file -->
<script
  data-host-id="4"
  data-origin="https://vocechat.yourdoamin.com"
  data-close-width="52"
  data-close-height="52"
  data-open-width="600"
  data-open-height="800"
  src="https://vocechat.yourdoamin.com/widget.js"
  async
/>
```

配置项说明:

<table ><thead ><tr><th scope="col"  >配置键</th><th scope="col"  >默认值</th><th scope="col"  >备注</th></tr></thead><tbody><tr ><td >host-id</td><td >1</td><td >指定访客和谁聊天</td></tr><tr ><td >origin</td><td >location.origin</td><td >指明脚本的来源</td></tr><tr ><td >close-width</td><td >52(px)</td><td >挂件关闭态的宽度</td></tr><tr ><td >close-height</td><td >52(px)</td><td >挂件关闭态的高度</td></tr><tr ><td >open-width</td><td >600(px)</td><td >挂件打开态的宽度</td></tr><tr ><td >open-height</td><td >800(px)</td><td >挂件打开态的高度</td></tr></tbody><tfoot ><tr><td colspan="3">* 所有的配置项目都是可选的，并以<i >data-</i>开头</td></tr></tfoot></table>
