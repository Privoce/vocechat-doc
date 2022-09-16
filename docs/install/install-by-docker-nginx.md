---
sidebar_position: 2
title: Install with Docker and Nginx
---

# Deploy nginx by docker

## Quick deploy HTTP site

```shell
mkdir -p /home/nginx/conf/conf.d
mkdir -p /home/nginx/log
mkdir -p /home/wwwroot/rocket.voce.chat
echo "hello, world!" > /home/wwwroot/rocket.voce.chat/index.html
cat > /home/nginx/conf/conf.d/rocket.voce.chat.conf << EOF
server {
    listen 80;
    server_name rocket.voce.chat;
    location / {
        root   /home/wwwroot/rocket.voce.chat;
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
    -v /home/nginx/conf/conf.d/rocket.voce.chat.conf:/etc/nginx/conf.d/rocket.voce.chat.conf \
    -v /home/nginx/log:/var/log/nginx \
    -v /home/wwwroot/:/home/wwwroot/ \
    nginx
tail -f /home/nginx/log/*.log
```

access: https://rocket.voce.chat/

## Deploy HTTPS site

Prepare the certificate file, rocket.voce.chat.crt, rocket.voce.chat.keys

```shell
mkdir -p /home/nginx/conf/cert
cp -rf rocket.voce.chat.crt /home/nginx/conf/cert/
cp -rf rocket.voce.chat.key /home/nginx/conf/cert/

mkdir -p /home/nginx/conf/conf.d
mkdir -p /home/nginx/log
mkdir -p /home/wwwroot/rocket.voce.chat
echo "hello, world!" > /home/wwwroot/rocket.voce.chat/index.html
cat > /home/nginx/conf/conf.d/rocket.voce.chat.conf << EOF
server {
    listen 80;
    server_name rocket.voce.chat;
    return 301 https://rocket.voce.chat$request_uri;
}
server {
    listen       443 default_server;
    server_name  rocket.voce.chat; # Change to your own domain name
    ssl on;
    ssl_certificate cert/rocket.voce.chat.crt; # Change to your own CRT file storage path
    ssl_certificate_key cert/rocket.voce.chat.key;    # Change to your own key file storage path
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    location / {
        root   /home/wwwroot/rocket.voce.chat;
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
    -v /home/nginx/conf/conf.d/rocket.voce.chat.conf:/etc/nginx/conf.d/rocket.voce.chat.conf \
    -v /home/nginx/conf/cert:/etc/nginx/cert \
    -v /home/nginx/log:/var/log/nginx \
    -v /home/wwwroot/:/home/wwwroot/ \
    nginx
tail -f /home/nginx/log/*.log
```

access: https://rocket.voce.chat/

## Nginx Reverse proxy, configure certificate on Nginx side.

Nginx listens port 443, so that you need to configure the certificate on the Nginx side and forward it to vocechat-server:3000, in this case, vocechat-server is working on normal HTTP model.
If you alredy have a running Nginx server, you will need to prepare **CA** and find the configuration file of nginx, then append the following in the appropriate position.

```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │  Nginx  │        │         │
│ Client  ├─────────────────►│    CA   ├──────► │ vocechat│
│         │                  │   443   │        │   3000  │
└─────────┘                  └─────────┘        └─────────┘
```

Append nginx.conf:

```nginx
server {
    listen       443;
    server_name  www.domain.com;                # change to your domain
    ssl on;
    ssl_certificate www.domain.com.crt;         # change to your .crt file path
    ssl_certificate_key www.domain.com.key;     # change to your .key file path
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    location / {
        proxy_pass http://127.0.0.1:3000; # node: change to 172.17.0.1:3000 in docker
        proxy_redirect off;
        proxy_set_header        Host    $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0; # close disk buffer, accelerate writing
        proxy_connect_timeout 90;   # The following parameters avoid inheriting the global nginx configuration
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

# rewrite 80 -> 443
server {
    listen       80;
    server_name  www.domain.com; # change to your domain
    rewrite ^(.*) https://$host$1 permanent;
}
```

then, start vocechat-server

```shell
mkdir -p ~/.vocechat-server/data
docker run -d --restart=always \
  -p 3000:3000 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  Privoce/vocechat-server:latest \
  --network.domain "www.domain.com"
```

visit: https://www.domain.com/

## Nginx reverse proxy, apply for SSL certificate through vocechat-server automatically.

Nginx transparently forward to vocechat-server by identifying the `Host` in data stream. Certificate is registered and configured by vocechat-server side.
Note: at this time, Nginx will fully forward all stream of the port 443, so that you can't configure port 443 related separately! Yet it can be forwarded to multiple back-end HTTPS services.

```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │         │        │ vocechat│
│ Client  ├─────────────────►│  Nginx  ├──────► │   CA    │
│         │                  │         │        │   443   │
└─────────┘                  └─────────┘        └─────────┘
```

Find nginx.conf, http {...}, Append:

```shell
stream {
    upstream www_domain_com {
        server 127.0.0.1:3000; # if in docker, change to 172.17.0.1:3000
    }

    # upstream www_domain_com2 {
    #    server 127.0.0.1:3001; # change port
    # }

    map $ssl_preread_server_name $upstream {
	    www.domain.com www_domain_com; # replace www.domain.com to your domain
	    #www.domain2.com www_domain_com2; # multiple domains
    }

    server {
        listen 443;
        ssl_preread on;
        # proxy_cache off;
        proxy_pass $upstream;
    }
}
```

then, start vocechat-server

```bash
mkdir -p ~/.vocechat-server/data
docker run -d --restart=always \
  -p 443:443 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  Privoce/vocechat-server:latest \
  --network.bind "0.0.0.0:443" \
  --network.domain "www.domain.com" \
  --network.tls.type "acme_tls_alpn_01" \
  --network.tls.acme.cache_path "/home/vocechat-server/data/cert"
```

visit: https://www.domain.com/
