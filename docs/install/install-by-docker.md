---
sidebar_position: 1
title: Docker
description: Docker+Nginx are recommended
---

## 本地快速体验

:::tip
假如没有服务器，但是在本地电脑装有 Docker，可以执行以下命令行，快速体验 VoceChat
:::

```shell
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```

浏览器访问: http://localhost:3000/

## 服务器部署

### Docker + Nginx

#### 运行 VoceChat

```shell
docker run -d --restart=always \
  -p 3009:3000 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  privoce/vocechat-server:latest

```

### 或者使用docker-compose一键部署

```yaml
version: "3"
services:
  vocechat:
    image: "privoce/vocechat-server:latest"
    container_name: "vocechat"
    restart: "always"
    ports:
      - "3000:3000"
    volumes:
      - "/etc/localtime:/etc/localtime" # 保证和服务器时区一致
      - "./data:/home/vocechat-server/data" # 数据目录
    command:
      - --network.frontend_url vocechat.yourdomain.com # 站点url
```

#### 配置 Nginx http 反向代理

在 Nginx 配置文件目录（一般在`/etc/nginx/conf.d`）新建 Nginx 配置文件`vocechat.yourdomain.com.conf`，并配置好 http 请求：

```nginx
server{
  server_name vocechat.yourdomain.com;
  location / {
        proxy_pass http://127.0.0.1:3009; # 此处端口号取决于docker运行的对外端口号
        proxy_redirect off;
        proxy_set_header        Host    $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0; # 关掉硬盘缓存，增加写速度
        # SSE 相关配置
        proxy_http_version 1.1;
        proxy_set_header Connection '';
    }
}
```

检查配置文件的语法：`nginx -t`，没问题后，启用新增配置：`nginx -s reload`。此时，浏览器访问`http://vocechat.yourdomain.com`，能够进入初始化页面，即为配置成功。

:::caution 提示
不要忘记设置域名解析
:::

#### 配置 https

基本原理：让 Nginx 监听 443 端口，证书配置在 Nginx，通过 host 转发给 `vocechat-server:3000`，此时 vocechat-server 接受的依旧是 http。

```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │  Nginx  │        │         │
│ Client  ├─────────────────►│    CA   ├──────► │ vocechat│
│         │                  │   443   │        │   3000  │
└─────────┘                  └─────────┘        └─────────┘
```

启用 https 有多种方式，此处我们推荐使用[certbot](https://certbot.eff.org/instructions)，借助 certbot 可以自动生成证书并自动添加到对应域名的 Nginx 配置文件，完成 https 的启用。

##### Certbot 的使用

访问 https://certbot.eff.org/instructions ，请自行选择服务器环境，完成安装:

![certbot install](image/certbot.install.png)

使用以下命令，certbot 会列出已有的 Nginx 配置，选择对应的域名，获取证书，并让 certbot 自动编辑该 Nginx 配置文件，一键开启 https 访问：

```shell
# 如果非root用户，把sudo加上
sudo certbot certonly --nginx
```

此时，配置文件`vocechat.yourdomain.com.conf`已变为：

```nginx

server{
    server_name vocechat.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3009; # 此处端口号取决于docker运行的对外端口号
        proxy_redirect off;
        proxy_set_header        Host    $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0; # 关掉硬盘缓存，增加写速度
        # SSE 相关配置
        proxy_http_version 1.1;
        proxy_set_header Connection '';
    }
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/vocechat.yourdomain.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/vocechat.yourdomain.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server{
    if ($host = vocechat.yourdomain.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
  listen 80;
  server_name vocechat.yourdomain.com;
    return 404; # managed by Certbot
}

```

重载 Nginx 配置（`nginx -s reload`）之后，此时，浏览器访问`http://vocechat.yourdomain.com`会自动切换为 https，即`https://vocechat.yourdomain.com`

### Docker

:::tip
如果你的服务器没有被其它服务占用 https 端口（即 443），可以考虑该方式，否则，请参考 [Docker + Nginx](/install/install-by-docker#docker--nginx)
:::

vocechat-server 支持自动申请 https 证书（借助[CertBot](https://certbot.eff.org/pages/about)），使用该部署方式有两个前提：

- 服务器 443 端口没有被占用
- 准备一个域名，并已解析到该服务器 IP。

```bash
mkdir -p ~/.vocechat-server/data
docker run -d --restart=always \
  -p 443:443 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  privoce/vocechat-server:latest \
  --network.bind "0.0.0.0:443" \
  --network.domain "vocechat.yourdomain.com" \
  --network.tls.type "acme_tls_alpn_01" \
  --network.tls.acme.cache_path "/home/vocechat-server/data/cert"
```

参数说明:

- `network.bind:` 服务端绑定的 IP 和端口，`0.0.0.0` 为所有 IP
- `network.domain:` 域名
- `network.type:` TLS 验证方式，这里为 `acme_tls_alpn_01`，更多请参考代码目录 `config/config.toml` 。
- `network.tls.acme.cache_path:` 证书存放位置。
- `network.tls.acme.directory_url:` 默认的验证机构，可选，默认 `https://acme-v02.api.letsencrypt.org/directory`。

访问:`https://vocechat.yourdomain.com/`，完成初始化 。

如果 80/443 端口被 Nginx 占用, 请参考 [Docker + Nginx](/install/install-by-docker#docker--nginx)

## 其他相关命令

### 停止服务

```bash
docker stop vocechat-server
```

### 查看日志

```bash
docker logs -f vocechat-server
```

### 备份数据

```bash
cp -rf ~/.vocechat-server/data ~/.vocechat-server/backup
```

### 更新 Docker

```shell
docker stop vocechat-server
docker rm vocechat-server
docker pull privoce/vocechat-server:latest

# 这里改为自己之前部署执行过的docker命令行
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest

```

### 进入 Docker 内部

```shell
docker exec -it vocechat-server /bin/sh
cd /home/vocechat-server/data
```

## 使用 widget 扩展聊天场景

部署成功 vocechat，并且已完成初始化工作，可以很方便地借助 widget，把聊天场景拓展到任意网站。具体请参看 [使用挂件](/widget)

:::tip
如需要帮助，请在官网联系我们：[https://voce.chat](https://voce.chat) ，如需合作请 email 联系 **han@privoce.com**
:::
