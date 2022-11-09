---
sidebar_position: 4
slug: /widget
title: 使用挂件（widget）
---

Extending VoceChat by embedding the vocechat widget SDK!
Code Example:

```html
<!-- put this code snippet into your html file -->
<script
  data-host-id="1"
  data-origin="https://privoce.voce.chat"
  data-close-width="52"
  data-close-height="52"
  data-open-width="600"
  data-open-height="800"
  src="https://privoce.voce.chat/widget.js"
  async
/>
```

Configuration Description:

|Parameter Key | Default Value |Remarks

host-id 1 Assign the user chatting with visitor
origin location.origin The domain (with protocol) script load from
close-width 52(px) The width while widget closed
close-height 52(px) The height while widget closed
open-width 600(px) The width while widget opened
open-height 800(px) The height while widget opened

- All the parameters are optional, and prefixed by data-
