---
sidebar_position: 4
title: Video and Audio Call (Agora)
---

VoceChat video and audio call requires your own Agora WebRTC API key (free to use, 167 hours free usage per month.)

## Apply for Agora API：

- Agora.io Sign up
- Some countries IP require KYC (most countries does not)
- Create a project（https://console.agora.io/projects）
![](image/agora.create.project.png)

## 1st step：Get Agora project info

Go to settings, you will see the info we need.

![](image/agora.setting.info.png)

> Project ID can be found from your URL: e.g.: https://console.agora.io/project/xxx has Project ID xxx

From https://console.agora.io/restfulApi generate keys(Customer ID & Customer Secret):

![](image/agora.create.secret.jpg)

## 2nd step：Go to VoceChat settings -> Agora

Go to VoceChat settings, copy and paste your Agora project info there:
![](image/agora.setting.png)

Now you are all set. Let's use video/audio call!

## How to join video/audio calls

There's an icon at the right column of each chat window:
![](image/agora.entry.png)


## Attention

- Agora.io is a third party WebRTC service, we found their service stable and has a generous free tier.
- Agora's 167 hours/month free tier is based on the total usage: if 10 users are using your server for video/audio calls, on average each user can only use 16.7 hours for free.
