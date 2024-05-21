---
title: Gmail
---

# How to set up SMTP?

The goal of setting up SMTP is to allow your Vocechat server sending emails to your Vocechat members (e.g., to verify emails during new members signing up)

With vocechat-server launched, visit your vocechat domain (http://localhost:3000/ if you are testing it locally), login with administrator account, click the "Settings" button in the lower left corner, go to the "SMTP Setting" page, snapshot as follows:

<!-- ![smtp-setting.jpg](./image/smtp-setting.jpg) -->

## Enable Gmail SMTP.

Go to Gmail. See all settings.
![image](https://github.com/Privoce/vocechat-doc/assets/12148615/c7b3d523-ce49-44ea-b84a-5c07af5d7972)

Turn on IMAP
![Screenshot 2024-05-20 at 23 12 19](https://github.com/Privoce/vocechat-doc/assets/12148615/6529afcf-5450-4ad7-97ea-f83cf7152586)

Visit this link: https://myaccount.google.com/apppasswords 

Create an app
![Screenshot 2024-05-20 at 23 16 13](https://github.com/Privoce/vocechat-doc/assets/12148615/a353d694-bf02-4ff7-8548-8be2055c2ed9)

Remember this password
![Screenshot 2024-05-20 at 23 28 40](https://github.com/Privoce/vocechat-doc/assets/12148615/74fba149-d72c-4a31-9afa-467e26b9768f)

Copy the password and fill it in the SMTP settings, use Port 465.
![image](https://github.com/Privoce/vocechat-doc/assets/12148615/b0ca919a-7257-4a7f-889c-5aecd20d754e)

All set!
