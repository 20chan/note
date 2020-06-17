# note

Fullstack note web app using docker.

Built with `typescript`, `express`, `react`, `caddy`, `docker`, `docker-compose`

## How to run

```shell
$ docker-compose up -d
```

## Architecture

- [server](/server): typescript, express, dockerized
- [client](/client): typescript, react, dockerized
- [proxy](/proxy): caddy, dockerized

```
nginx -> caddy:7000 -> /api server:7001
                    -> /    client:7002
```
