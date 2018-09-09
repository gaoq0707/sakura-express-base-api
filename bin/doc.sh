#!/usr/bin/env bash

cat document/api/host.md \
    document/header.md \
    document/common.md \
    >document/api.apib
find document/api/v1 -type f -exec cat {} \;>>document/api.apib

cat document/appapi/host.md \
    document/header.md \
    document/common.md \
    >document/app.apib
find document/appapi/v1 -type f -exec cat {} \;>>document/app.apib

echo "docs start"

aglio --theme-full-width -t flatly -i document/api.apib -o document/api.html
aglio --theme-full-width -t flatly -i document/app.apib -o document/app.html

echo "docs finish"