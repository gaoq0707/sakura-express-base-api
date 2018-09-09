FROM harbor.gagogroup.cn/base/centos_node-8.11.2_npm-5.6.0
WORKDIR /usr/local/
RUN mkdir breed-sd-api/
ADD . breed-sd-api/
WORKDIR /usr/local/breed-sd-api/
RUN npm install
RUN npm run build

CMD ["sh", "bin/start_from_docker.sh"]