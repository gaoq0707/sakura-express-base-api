#!/usr/bin/env bash

# build image from docker file
docker build -t harbor.gagogroup.cn/financial-insurance-projects/{{projectName}}:latest .

# push them
docker push harbor.gagogroup.cn/financial-insurance-projects/{{projectName}}:latest
