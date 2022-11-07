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

<table ><thead ><tr><th scope="col"  >Parameter Key</th><th scope="col"  >Default Value</th><th scope="col"  >Remarks</th></tr></thead><tbody><tr ><td >host-id</td><td >1</td><td >Assign the user chatting with visitor</td></tr><tr ><td >origin</td><td >location.origin</td><td >The domain (with protocol) script load from</td></tr><tr ><td >close-width</td><td >52(px)</td><td >The width while widget closed</td></tr><tr ><td >close-height</td><td >52(px)</td><td >The height while widget closed</td></tr><tr ><td >open-width</td><td >600(px)</td><td >The width while widget opened</td></tr><tr ><td >open-height</td><td >800(px)</td><td >The height while widget opened</td></tr></tbody><tfoot ><tr><td colspan="3">* All the parameters are optional, and prefixed by <i >data-</i></td></tr></tfoot></table>
