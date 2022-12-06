---
sidebar_position: 3
title: Godaddy
---

# Get SSL on Godaddy

Some basics on SSL。

- .key: PKCS8 private key（Base64）
- .csr: PKCS10 partial certificate info（including public key, domain, organization info. Public key is generated through private key--".key")
- .crt: Certificate file, add CA signature info upon .csr (Godaddy will generate it based on user uploaded .csr file)
- .der: bynary file, can be converted to pem and vice versa with the following command: `openssl x509 -inform der -in xxx.der -out xxx.pem`
- .pem: base64 file, could be private key, public key or certificate.
- .p12, .pkcs12, .pfx: PKCS12 composed file including info of private key, public key or certificate, etc.

### 1. Generate Private Key & CSR & Certificate in your local machine (not a real certificate and we will replace this certificate soon):

```shell
# Generate private key, and we are using vocechat.com as an example domain
openssl genpkey -algorithm RSA \
    -pkeyopt rsa_keygen_bits:4096 \
    -pkeyopt rsa_keygen_pubexp:65537 | \
    openssl pkcs8 -topk8 -nocrypt -outform pem > vocechat.com.key

# Generate CSR file
openssl req -subj "/C=US/ST=Arizona/L=Scottsdale/O=vocechat,Inc./CN=vocechat.com/emailAddress=api.privoce@gmail.com" \
    -new -days 3650 -key vocechat.com.key -out vocechat.com.csr

# Generate signkey file
openssl x509 -signkey vocechat.com.key -in vocechat.com.csr -req -days 365 -out vocechat.com.crt

# Check certificate
openssl req -text -noout -verify -in vocechat.com.csr
```

You will have the following files generated which are important. Please keep those files securely saved：

```shell
-rw-r--r--  1 user  staff   1.9K May  5 00:34 vocechat.com.crt
-rw-r--r--  1 user  staff   1.7K May  5 00:34 vocechat.com.csr
-rw-r--r--  1 user  staff   3.2K May  5 00:29 vocechat.com.key
```

With .key, .crt we can setup servers like nginx, although browsers will have a warning.

### 2. Sign in to Godaddy, buy SSL certificate。

Godaddy：https://www.godaddy.com/

### 3. Set domain & CSR：

![Godaddy-Manae-Cert](image/godaddy-manage-cert.jpg)
![Godaddy-Update-CSR](image/godaddy-update-csr.jpg)

### 4. Download SSL certificate

![Godaddy-Download-Cert](image/godaddy-download-cert.jpg)  
Will be ziped to a file like xxx.zip, and you need to unzip to get the following files：

```shell
-rw-rw-r--@ 1 user  staff   2.4K May  4 07:47 1aeb156731cb52d3.crt
-rw-rw-r--@ 1 user  staff   2.4K May  4 07:47 1aeb156731cb52d3.pem
-rw-rw-r--@ 1 user  staff   4.7K May  4 07:47 gd_bundle-g2-g1.crt
```

### 5. Combine the files and replace the old certificate just now (as we have a real certificate now).

```shell
cat 1aeb156731cb52d3.crt gd_bundle-g2-g1.crt > vocechat.com.crt
```

### 6。 vocechat-server settings

Copy the certificate files：

```
cp vocechat.com.crt cert/ca.crt
cp vocechat.com.key cert/ca.key
```

Change config/config.toml

```shell

[network]
bind = "0.0.0.0:3000"
domain = "domain.com"

# [network.tls]
# type = "self_signed"

[network.tls]
type = "certificate"
# cert = "/path/vocechat.com.crt"
# key = "...."
path = "./cert"
```

Restart vocechat-server:

```shell
/etc/init.d/vocechat-server restart
```

<!--
```shell
server {
    listen 443;
    server_name www.xxx.com;
    ssl	on;
    ssl_certificate /usr/local/ssl/domain.crt;
    ssl_certificate_key /usr/local/ssl/domain.key;
}
```
-->

All set:)
