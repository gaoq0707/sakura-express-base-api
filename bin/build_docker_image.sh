#!/usr/bin/env bash
VERSION=`date +%Y%m%d-%H`

# build image from docker file
docker build -t harbor.gagogroup.cn/financial-insurance-projects/ahic-breed-sd-api:${VERSION} -t harbor.gagogroup.cn/financial-insurance-projects/ahic-breed-sd-api:latest .

# push them
# docker push harbor.gagogroup.cn/financial-insurance-projects/ahic-breed-sd-api:${VERSION}
docker push harbor.gagogroup.cn/financial-insurance-projects/ahic-breed-sd-api:latest
