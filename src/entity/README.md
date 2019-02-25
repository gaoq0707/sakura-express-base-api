# 目录说明

该目录中存放具体的MVC层的代码,一般每张表为一个文件夹,可以如下划分:

1. 第一种

* entity
    * user (user表)
        * user.ts
        * user-controller.ts
        * user-service.ts
        * user-repository.ts
    * role
    * ...

2. 第二种

* entity
    * users (模块)
        * user (user表)
            * user.ts
            * user-controller.ts
            * user-service.ts
            * user-repository.ts
        * role
        * ...
    * test (模块)
    * ...
    
