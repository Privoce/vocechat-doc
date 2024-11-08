---
sidebar_position: 7
title: 在命令行下修改用户/管理员密码
---

# 在命令行下修改用户/管理员密码
有时侯我们会忘记密码，通过命令行可以不受业务逻辑约束。  
用户的密码等信息都保存在 user 表中(sqlite3)，我们直接操作这张表。  

具体步骤：

## 如果是 Docker 启动的 vocechat-server
1. 停止容器
```
docker stop vocechat-server
```

2. 从容器复制文件到主机
```
docker cp vocechat-server:/home/vocechat-server/data/db/db.sqlite ./db.sqlite
sqlite3 db.sqlite
update user set password='14e1b600b1fd579f47433b88e8d85291' where email='admin@email.com';
.exit
```

3. 将修改后的文件复制回容器
```
docker cp ./db.sqlite vocechat-server:/home/vocechat-server/data/db/db.sqlite
```
4. 启动容器
```
docker start vocechat-server
```

### 如果是命令行启动的 vocechat-server
```
cd vocechat-server/data/db
sqlite3 db.sqlite
update user set password='14e1b600b1fd579f47433b88e8d85291' where email='admin@email.com';
.exit
```

解释：
`admin@email.com` 为需要修改的 Email
`a02cc9a3fc5def5275b5ca22f0d8f414privoce` 对应的密码为 `123456`