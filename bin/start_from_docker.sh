#!/bin/bash
pm2-docker start bin/pm2.config.json --env $NODE_ENV
