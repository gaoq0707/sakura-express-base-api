#!/bin/bash
echo ""
tslint -c "tslint.json" "src/**/*.ts" "src/**/**/*.ts" "src/*.ts"
if [ $? -eq 0 ]
then echo -e "\033[32m api tslint successed! \033[0m"
else exit 127
fi
