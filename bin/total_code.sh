#!/bin/bash

echo -e "\033[32m 统计代码行数: \033[0m"

cd src
find . -name "*.ts"|xargs cat|grep -v -e ^$ -e ^\s*\/\/.*$|wc -l
cd ..
