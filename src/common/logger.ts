/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import {configure, getLogger, Logger} from "log4js";

/*
* 日志中间件
* 系统日志基于log4js实现，日志全部记录在../logs文件夹下
* 本系统共记录如下几种日志:
* 1.登录日志,存放login文件夹
* 2.非授权访问操作日志,存放auth文件夹下
* 3.系统增加、删除、修改、数据导出操作日志,存放在operate文件夹下
* 4.系统日志，存放在app文件夹下
* 5.sql执行日志，存放在sql文件夹下
* 6.api请求日志，存放在request文件夹下
*
* */

configure({
  appenders: {
    cheese: {
      type: "file",
      filename: "../logs/cheese.log",
      maxLogSize: 51200,
      backups: 5
    },
    loginConsole: {type: "console"},
    authConsole: {type: "console"},
    operateConsole: {type: "console"},
    appConsole: {type: "console"},
    sqlConsole: {type: "console"},
    requestConsole: {type: "console"},
    exceptionConsole: {type: "console"},
    loginLog: {
      type: "file",
      filename: "../logs/login.log",
      maxLogSize: 51200,
      backups: 5
    },
    authLog: {
      type: "file",
      filename: "../logs/auth.log",
      maxLogSize: 51200,
      backups: 5
    },
    operateLog: {
      type: "file",
      filename: "../logs/operate.log",
      maxLogSize: 51200,
      backups: 5
    },
    appLog: {
      type: "file",
      filename: "../logs/app.log",
      maxLogSize: 51200,
      backups: 5
    },
    sqlLog: {
      type: "file",
      filename: "../logs/sql.log",
      maxLogSize: 51200,
      backups: 5
    },
    requestLog: {
      type: "file",
      filename: "../logs/request.log",
      maxLogSize: 51200,
      backups: 5
    },
    exceptionLog: {
      type: "file",
      filename: "../logs/exception.log",
      maxLogSize: 51200,
      backups: 5
    }
  },
  categories: {
    default: {appenders: ["cheese"], level: "info"},
    login: {appenders: ["loginConsole", "loginLog"], level: "info"},
    auth: {appenders: ["authConsole", "authLog"], level: "info"},
    operate: {appenders: ["operateConsole", "operateLog"], level: "info"},
    app: {appenders: ["appConsole", "appLog"], level: "info"},
    sql: {appenders: ["sqlConsole", "sqlLog"], level: "info"},
    request: {appenders: ["requestConsole", "requestLog"], level: "info"},
    exception: {appenders: ["exceptionConsole", "exceptionLog"], level: "info"}
  },
  pm2: true,
  pm2InstanceVar: "INSTANCE_ID"
});

let logger: Logger = getLogger();
let loginLogger: Logger = getLogger("login");
let authLogger: Logger = getLogger("auth");
let operateLogger: Logger = getLogger("operate");
let appLogger: Logger = getLogger("app");
let sqlLogger: Logger = getLogger("sql");
let requestLogger: Logger = getLogger("request");
let exceptionLogger: Logger = getLogger("exception");

export {
  logger as Logger,
  loginLogger as LoginLogger,
  authLogger as  AuthLogger,
  operateLogger as  OperateLogger,
  appLogger as  AppLogger,
  sqlLogger as  SQLLogger,
  requestLogger as  RequestLogger,
  exceptionLogger as ExceptionLogger
};

