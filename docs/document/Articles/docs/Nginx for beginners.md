# `Nginx` for beginners

## Installation

### Windows

- Download mainline version from [official website](https://nginx.org/en/download.html)
- Decompress the zip file at somewhere of your machine.
- `cd` to your decompressed folder, run `./nginx`.
- Open `localhost:80` in your browser to check if `nginx` is successfully started.

## Serving static content

Let's start configuring `nginx.conf` from scratch. You can find this file in your decompressed folder(`./conf/nginx.conf`) if you're in windows.

- First, have a `html` file on your machine.

```html
<!DOCTYPE html>
<html>
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>Hello</title>
</head>
<body>
 <p>Hello from nginx</p>
</body>
</html>
```

- Edit your `nginx.conf` as. Double quote is optional.

```text
http {
    server {
        listen 8080;
        root "path/to/your/parent/folder";
    }
}

events {}
```

- Restart `nginx`, you should find out that `localhost:8080` is the html we made.

```bash
./nginx -s reload
```

## Content type

All contents are `text/plain` by default, but this will lead to some issue like isolated css not working for html.
So, to serve different types of content, add file extensions matching to content types.

```text
http {
    types {
        text/css css;
        text/html html;
    }
    server {
        listen 8080;
        root "path/to/your/parent/folder";
    }
}

events {}
```

However, `nginx` has predefined many type matching in `mime.types`. Simply adding `include` in `nginx.conf` is just fine.

```text
http {
    include mime.types;
    server {
        listen 8080;
        root "path/to/your/parent/folder";
    }
}

events {}
```

## Location Context

Location is similar to api route that works when we access `localhost:port/<route>`. However, should match to the folder structure.

### Location

To access `index.html` in a different folder, we can make a **location** in server.
    - Create a folder `product` with `index.html`.

```text
http {
    include mime.types;
    server {
        listen 8080;
        root "path/to/your/parent/folder";
        location /product {
            root "path/to/your/parent/folder";
        }
    }
}

events {}
```

### Alias

To make a alias for a location, since it's a alias, we don;t have to make a folder named 'item'.

```text
http {
    include mime.types;
    server {
        listen 8080;
        root "path/to/your/parent/folder";
        location /product {
            root "path/to/your/parent/folder";
        }
        location /item {
            alias "path/to/your/parent/folder/product";
        }
    }
}

events {}
```

### Access any file

`nginx` serve `index.html` by default. So, if `index.html` is not what we want to access, we should have a way to resolve it. The following config will try to access `car/car.html` if it exist, or it will fall back to `/index.html`. If all files are failed, it should show a `404` error page.

```text
http {
    include mime.types;
    server {
        listen 8080;
        root "path/to/your/parent/folder";
        location /product {
            root "path/to/your/parent/folder";
        }
        location /item {
            alias "path/to/your/parent/folder/product";
        }
        location /car {
            root "path/to/your/parent/folder";
            try_files /car/car.html /index.html =404;
        }
    }
}

events {}
```

### Access using regex

`nginx` supports regex notate with `~*` to match dynamic locations.

```text
http {
    include mime.types;
    server {
        listen 8080;
        root "path/to/your/parent/folder";
        location /product {
            root "path/to/your/parent/folder";
        }
        location /item {
            alias "path/to/your/parent/folder/product";
        }
        location /car {
            root "path/to/your/parent/folder";
            try_files /car/car.html /index.html =404;
        }
        location ~* /id/[0-9] {
            root "path/to/your/parent/folder";
            try_files /index.html =404;
        }
    }
}

events {}
```

## Redirect and Rewrite

### Redirect

Redirecting is jumping from a location to another. The following will redirect to `/product/index.html` when we access `localhost:8080/list`.

```text
http {
    include mime.types;
    server {
        listen 8080;
        root "path/to/your/parent/folder";
        location /product {
            root "path/to/your/parent/folder";
        }
        location /item {
            alias "path/to/your/parent/folder/product";
        }
        location /car {
            root "path/to/your/parent/folder";
            try_files /car/car.html /index.html =404;
        }
        location ~* /id/[0-9] {
            root "path/to/your/parent/folder";
            try_files /index.html =404;
        }
        location /list {
            return 307 /product
        }
    }
}

events {}
```

### Rewrite

Rewriting is another way to alias a location but with regex. The following rewrite will mapping all matched location to `/count/`.

```text
http {
    include mime.types;
    server {
        listen 8080;
        root "path/to/your/parent/folder";
        location /product {
            root "path/to/your/parent/folder";
        }
        location /item {
            alias "path/to/your/parent/folder/product";
        }
        location /car {
            root "path/to/your/parent/folder";
            try_files /car/car.html /index.html =404;
        }
        location ~* /id/[0-9] {
            root "path/to/your/parent/folder";
            try_files /index.html =404;
        }
        location /list {
            return 307 /product
        }
        rewrite ^/number/(w+) /count/$1;
    }
}

events {}
```
