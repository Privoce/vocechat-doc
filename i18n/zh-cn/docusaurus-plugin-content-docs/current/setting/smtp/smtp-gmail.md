---
title: Gmail设置
---

# 如何设置 SMTP ?

在启动 vocechat-server 后，访问 http://localhost:3000/，管理员账号登录，点击左下角图标"设置"，进入 SMTP 设置页面，如下：
![smtp-setting.jpg](image/smtp-setting.jpg)

## Gmail SMTP 开启方法。

登录 https://gmail.com/ 

右上角设置，查看所有设置：

![image](https://github.com/Privoce/vocechat-doc/assets/12148615/38c487ea-9a81-4e4e-a026-c1fd4bc1e187)

启用IMAP：

![image](https://github.com/Privoce/vocechat-doc/assets/12148615/7efe0cd7-7276-4c1f-ba05-b53c703190f3)

访问这个地址：https://myaccount.google.com/apppasswords

生成一个app：
![image](https://github.com/Privoce/vocechat-doc/assets/12148615/f2b167f5-ba6e-4e5e-979b-a44d2fb37e24)

记住这个密码：
![image](https://github.com/Privoce/vocechat-doc/assets/12148615/eca9b0e4-c840-4e79-ab5d-0d60dd10bfad)

回到VoceChat SMTP，输入密码，port是465：
![image](https://github.com/Privoce/vocechat-doc/assets/12148615/b7e53879-ff20-4010-a7f8-bbe167786af6)

完成！

