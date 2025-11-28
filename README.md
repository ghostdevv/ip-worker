# ip-worker

A Cloudflare Worker that returns your IP address or IP country code.

## IP

Returns the IP v4 or v6 address of the request.

### GET `/` or GET `/ip`

```bash
$ curl https://ip.willow.sh/
127.0.0.1
```

```bash
$ curl https://ip.willow.sh/ \
    -H 'Accept: application/json'
{"ip":"82.30.43.178"}
```

## Country Code

Returns the country code of the request as determined by Cloudflare.

### GET `/cc`

```bash
$ curl https://ip.willow.sh/cc
GB
```

```bash
$ curl https://ip.willow.sh/cc \
    -H 'Accept: application/json'
{"cc":"GB"}
```
