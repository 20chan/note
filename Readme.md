# note

Fullstack note web app using docker.

Built with `typescript`, `express`, `react`, `caddy`, `mongodb`, `docker`, `docker-compose`

## How to run

```shell
$ docker-compose up -d
```

## Architecture

- [note-server](/server): typescript, express, mongodb, dockerized
- [note-client](/client): typescript, react, dockerized
- [note-proxy](/proxy): caddy, dockerized
- db: mongodb, dockerized

```
nginx -> caddy:7000 -> /api server:7001 -> db:27017
                    -> /    client:7002
```
