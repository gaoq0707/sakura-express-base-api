/**
 * esri log4js 本地日志,操作类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 * @deprecated
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
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/cheese_hh.log`,
      alwaysIncludePattern: true,
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
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/login_hh.log`,
      alwaysIncludePattern: true,
      maxLogSize: 51200,
      backups: 5
    },
    authLog: {
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/auth_hh.log`,
      alwaysIncludePattern: true,
      maxLogSize: 51200,
      backups: 5
    },
    operateLog: {
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/operate_hh.log`,
      alwaysIncludePattern: true,
      maxLogSize: 51200,
      backups: 5
    },
    appLog: {
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/app_hh.log`,
      alwaysIncludePattern: true,
      maxLogSize: 51200,
      backups: 5
    },
    sqlLog: {
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/sql_hh.log`,
      alwaysIncludePattern: true,
      maxLogSize: 51200,
      backups: 5
    },
    requestLog: {
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/request_hh.log`,
      alwaysIncludePattern: true,
      maxLogSize: 51200,
      backups: 5
    },
    exceptionLog: {
      type: "dateFile",
      filename: `./upload/log`,
      pattern: `/yyyy/MM/dd/exception_hh.log`,
      alwaysIncludePattern: true,
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

