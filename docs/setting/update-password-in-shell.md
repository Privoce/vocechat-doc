---
sidebar_position: 7
title: Modify user/admin password in Docker/Shell
---

# Modify user/admin password in Docker/Shell
Sometimes we forget our passwords, but we can bypass business logic constraints through the command line.  
The user's password and other information are stored in the user table (sqlite3), and we can directly operate on this table.  

Steps:

## Running in docker
1. Stop container
```
docker stop vocechat-server
```

2. copy file from container to host
```
docker cp vocechat-server:/home/vocechat-server/data/db/db.sqlite ./db.sqlite
sqlite3 db.sqlite
update user set password='14e1b600b1fd579f47433b88e8d85291' where email='admin@email.com';
.exit
```

3. copy back file from host to container
```
docker cp vocechat-server:/home/vocechat-server/data/db/db.sqlite ./db.sqlite
```

4. start container
```
docker start vocechat-server
```

### Running in Shell
```
cd vocechat-server/data/db
sqlite3 db.sqlite
update user set password='14e1b600b1fd579f47433b88e8d85291' where email='admin@email.com';
.exit
```

Explain:
`admin@email.com` for the password that needs to be changed
`a02cc9a3fc5def5275b5ca22f0d8f414privoce` the corresponding password is `123456`