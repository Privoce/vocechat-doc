---
sidebar_position: 1
title: Docker
description: Docker+Nginx are recommended
---

:::warning Important!
System architecture：the default settings is for `linux/amd64`, if you have `linux/arm64`, please use `privoce/vocechat-server:latest-arm64`
:::

## Try in your PC (localhost)

:::tip
If you have Docker in your local machine, you may run VoceChat with the following lines in your ternimal:
:::

```shell
docker run -d --restart=always \
  -p 3009:3000 \
  --name vocechat-server \
  privoce/vocechat-server:latest
```

Open this URL on your browser: `http://localhost:3009/`

## Run VoceChat on your server

:::tip
Let's suppose your domain is `vocechat.yourdomain.com`:
:::

### Method 1: Docker + Nginx

#### Run VoceChat

```shell
docker run -d --restart=always \
  -p 3009:3000 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  privoce/vocechat-server:latest \
  --network.frontend_url "https://vocechat.yourdomain.com"
```

:::tip
`network.frontend_url`is required to be changed to your domain, don't forget the `http(s)` part.
:::

#### Method 2: With Nginx http reverse proxy

At Nginx configration file（usually at `/etc/nginx/conf.d`）creat new file--`vocechat.yourdomain.com.conf`, and set up the http request like the following：

```nginx
server{
  server_name vocechat.yourdomain.com;
  location / {
        proxy_pass http://127.0.0.1:3009; # this port number "3009" should be the same as the port of the vocechat docker image
        proxy_redirect off;
        proxy_set_header        Host    $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0; # this line aims to maximize the writing speed
        # SSE Configrations
        proxy_http_version 1.1;
        proxy_set_header Connection '';
    }
}
```

Check your config file：`nginx -t`, if there's no problem, reload:`nginx -s reload`. Open your URL on your browser`http://vocechat.yourdomain.com`, then you should see VoeChat onboarding page.

:::caution Reminder
Don't forget to set up your DNS :)
:::

#### Set up https

How it works：Let nginx listen to port 443, the https SSL certificate is set to nginx so that port 443 is with https, and the reverse proxy will direct request to `vocechat-server:3009`.

```
┌─────────┐                  ┌─────────┐        ┌─────────┐
│         │                  │  Nginx  │        │         │
│ Client  ├─────────────────►│    CA   ├──────► │ vocechat│
│         │                  │   443   │        │   3000  │
└─────────┘                  └─────────┘        └─────────┘
```

There are two major ways of adding https SSL--use your own, or use our auto-generation (it's free!)[certbot](https://certbot.eff.org/instructions), with the help of certbot, we can automatically generate the SSL and Nginx config files, and your https will be ready.

##### Certbot Details

Visit https://certbot.eff.org/instructions, choose your env and download the certificate:

![certbot install](image/certbot.install.png)

Use the following lines to let certbot list out the current Nginx details, choose the domain that you want to use certbot, and let certbot automatically write the Nginx config file to enable https:

```shell
# if you are not a root user, add sudo
sudo certbot certonly --nginx
```

At this step, the `vocechat.yourdomain.com.conf` should be look like this：

```nginx

server{
    server_name vocechat.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3009; # this port number "3009" should be the same as the port of the vocechat docker image
        proxy_redirect off;
        proxy_set_header        Host    $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0; # this line aims to maximize the writing speed
        # SSE Configrations
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

Reload Nginx config (`nginx -s reload`), then visit `http://vocechat.yourdomain.com`, you can see there's https already! `https://vocechat.yourdomain.com`

### Method 3: Use docker on a server explicity for vocechat

:::tip
If you server is new and only for vocechat (nothing using https port 443), feel free to use this method, otherwise, use [Docker + Nginx](/install/install-by-docker#docker--nginx)
:::

vocechat-server will use certbot to apply for a free https SSL for you! ( See[CertBot](https://certbot.eff.org/pages/about)）, and to reiterate the prerequisites：

- your server's 443 is not in use.
- You already have a domain name pointing to your IP address.

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

Explanation of the parameters:

- `network.bind:` The IP and port the server binds with，`0.0.0.0` means all IPs
- `network.domain:` domain name
- `network.type:` TLS should be `acme_tls_alpn_01`, see more details here `config/config.toml` .
- `network.tls.acme.cache_path:` the path to store the certificate.
- `network.tls.acme.directory_url:` (not shown but you can change it) the default orgnization that checks your SSL certificate，the default is: `https://acme-v02.api.letsencrypt.org/directory`.

Visit:`https://vocechat.yourdomain.com/` to start using vocechat!

If 80/443 ports are used by Nginx, please see the Docker + Nginx method to install vocechat: [Docker + Nginx](/install/install-by-docker#docker--nginx)

## Other useful commands:

### Stop vocechat server

```bash
docker stop vocechat-server
```

### Check vocechat logs

```bash
docker logs -f vocechat-server
```

### Backup vocechat data

```bash
cp -rf ~/.vocechat-server/data ~/.vocechat-server/backup
```

### Update vocechat Docker

```shell
docker stop vocechat-server
docker rm vocechat-server
docker pull privoce/vocechat-server:latest

# Change the following lines to fit your own settings:)
docker run -d --restart=always \
  -p 3009:3000 \
  --name vocechat-server \
  -v ~/.vocechat-server/data:/home/vocechat-server/data \
  privoce/vocechat-server:latest \
  --network.frontend_url "https://vocechat.yourdomain.com"
```

### See Docker data

```shell
docker exec -it vocechat-server /bin/sh
cd /home/vocechat-server/data
```

## Use mobile APP or popup chat widget

After having vocechat on your server, feel free to use our mobile APP with your friends or collegues：[Use VoceChat APP](/mobile-app). Also, a popup widget is available to get embeded on any website for visitors to chat with the admin of the vocechat server [Use Chat Widget](/widget)

:::tip
If you still need help, feel free to chat with us on our official website: [voce.chat](https://voce.chat), if you want to collaborate with us, send an email to: **han@privoce.com**
:::
