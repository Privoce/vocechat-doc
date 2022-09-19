---
sidebar_position: 2
title: Docker&Nginx 安装
---

# 通过 Docker 部署 Nginx

## 快速部署 HTTP 站点:

```shell
mkdir -p /home/nginx/conf/conf.d
mkdir -p /home/nginx/log
mkdir -p /home/wwwroot/rocket.vocechat.com
echo "hello, world!" > /home/wwwroot/rocket.vocechat.com/index.html
cat > /home/nginx/conf/conf.d/rocket.vocechat.com.conf << EOF
server {
    listen 80;
    server_name rocket.vocechat.com;
    location / {
        root   /home/wwwroot/rocket.vocechat.com;
        index  index.html index.htm;
    }
}
EOF
docker stop nginx;
docker rm nginx;
docker run -itd \
    --restart=always \
    --name nginx \
    -p 80:80 \
    -v /home/nginx/conf/conf.d/rocket.vocechat.com.conf:/etc/nginx/conf.d/rocket.vocechat.com.conf \
    -v /home/nginx/log:/var/log/nginx \
    -v /home/wwwroot/:/home/wwwroot/ \
    nginx
tail -f /home/nginx/log/*.log
```

访问：https://rocket.vocechat.com/

## 部署 HTTPS 站点

准备好证书文件，rocket.vocechat.com.crt, rocket.vocechat.com.keys

```shell
mkdir -p /home/nginx/conf/cert
cp -rf rocket.vocechat.com.crt /home/nginx/conf/cert/
cp -rf rocket.vocechat.com.key /home/nginx/conf/cert/

mkdir -p /home/nginx/conf/conf.d
mkdir -p /home/nginx/log
mkdir -p /home/wwwroot/rocket.vocechat.com
echo "hello, world!" > /home/wwwroot/rocket.vocechat.com/index.html
cat > /home/nginx/conf/conf.d/rocket.vocechat.com.conf << EOF
server {
    listen 80;
    server_name rocket.vocechat.com;
    return 301 https://rocket.vocechat.com$request_uri;
}
server {
    listen       443 default_server;
    server_name  rocket.vocechat.com; # 修改为自己的域名
    ssl on;
    ssl_certificate cert/rocket.vocechat.com.crt; # 修改为自己的 crt 文件存放路径
    ssl_certificate_key cert/rocket.vocechat.com.key;    # 修改为自己的 key 文件存放路径
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    location / {
        root   /home/wwwroot/rocket.vocechat.com;
        index  index.html index.htm;
    }
}
EOF
docker stop nginx;
docker rm nginx;
docker run -itd \
    --restart=always \
    --name nginx \
    -p 80:80 \
    -p 443:443 \
    -v /home/nginx/conf/conf.d/rocket.vocechat.com.conf:/etc/nginx/conf.d/rocket.vocechat.com.conf \
    -v /home/nginx/conf/cert:/etc/nginx/cert \
    -v /home/nginx/log:/var/log/nginx \
    -v /home/wwwroot/:/home/wwwroot/ \
    nginx
tail -f /home/nginx/log/*.log
```

访问：https://rocket.vocechat.com/

## 1. Nginx 反向代理, Nginx 端配置证书

Nginx 监听 443 端口，证书配置在 Nginx，通过 host 转发给 vocechat-server:3000，此时 vocechat-server 是普通的 HTTP.
假定您已经有了自己的 nginx 服务器，需要准备好**域名证书**，然后找到 nginx 的配置文件，在合适的位置添加如下内容:

```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │  Nginx  │        │         │
│ Client  ├─────────────────►│    CA   ├──────► │ vocechat│
│         │                  │   443   │        │   3000  │
└─────────┘                  └─────────┘        └─────────┘
```

修改 nginx 配置文件，增加:

```
server {
    listen       443;
    server_name  www.domain.com;                # 修改为自己的域名
    ssl on;
    ssl_certificate www.domain.com.crt;         # 修改为自己的 crt 文件存放路径
    ssl_certificate_key www.domain.com.key;     # 修改为自己的 key 文件存放路径
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    location / {
        proxy_pass http://127.0.0.1:3000; # 注意：如果是 docker, 改为 172.17.0.1:3000
        proxy_redirect off;
        proxy_set_header        Host    $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0; # 直接关闭磁盘缓冲，加快速度
        proxy_connect_timeout 90;   # 以下参数避免继承全局的 nginx 配置
        proxy_send_timeout 90;
        proxy_read_timeout 90;
        proxy_buffer_size 4k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;
        proxy_temp_file_write_size 64k;
        # SSE correct settings:
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        # chunked_transfer_encoding: off; # not need
        # proxy_buffering off;            # instead by: X-Accel-Buffering: no
    }
}

# 配置跳转
server {
    listen       80;
    server_name  www.domain.com; # 修改为自己的域名
    rewrite ^(.*) https://$host$1 permanent;
}
```

然后，启动 vocechat-server

```shell
mkdir -p ~/.vocechat-server/data
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  vocechat/vocechat-server:latest \
  --network.domain "www.domain.com"
```

访问: https://www.domain.com/  
默认账号密码：admin@vocechat.com / 123456

## 2. Nginx 反向代理, vocechat-server 端自动申请和配置证书

Nginx 通过识别数据流中的 Host 透明转发给 vocechat-server，证书由 vocechat-server 来自动申请和配置。
**注意:此时 Nginx 会全面转发 443 端口的流量，不能再单独配置 443 相关的 Host 了，但是可以转发给多个后端的 HTTPS service。**
```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │         │        │ vocechat│
│ Client  ├─────────────────►│  Nginx  ├──────► │   CA    │
│         │                  │         │        │   443   │
└─────────┘                  └─────────┘        └─────────┘
```

找到 nginx 配置文件，在 http { ... } 的下方（不是里面!）添加:

```shell
stream {
    upstream www_domain_com {
        server 127.0.0.1:3000; # 如果是 docker 改为 172.17.0.1:3000
    }

    # upstream www_domain_com2 {
    #    server 127.0.0.1:3001; # 换一个端口
    # }

    map $ssl_preread_server_name $upstream {
	    www.domain.com www_domain_com; # 替换 www.domain.com 为自己的域名
	    #www.domain2.com www_domain_com2; # 可以配置多个域名
    }

    server {
        listen 443;
        ssl_preread on;
        # proxy_cache off;
        proxy_pass $upstream;
    }
}
```

然后启动 vocechat-server

````shell
```bash
mkdir -p ~/.vocechat-server/data
docker run -d --restart=always \
  -p 443:443 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  vocechat/vocechat-server:latest \
  --network.bind "0.0.0.0:443" \
  --network.domain "www.domain.com" \
  --network.tls.type "acme_tls_alpn_01" \
  --network.tls.acme.cache_path "/home/vocechat-server/data/cert"
````

访问: https://www.domain.com/  
