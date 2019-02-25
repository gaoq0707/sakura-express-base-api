/**
 * esri log4js->gago log server elk日志,操作类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {ElkLoggerUtils} from "../utils/elk-logger-utils";

/*
* 日志中间件
* 基于本地elk部署
* */

/*
* 普通日志
* */
export class ElkLogger {
  static info(message: any, meta: any = {}) {
    ElkLoggerUtils.collectLogger("info", message, meta);
  }

  static error(message: any, meta: any = {}) {
    ElkLoggerUtils.collectLogger("error", message, meta);
  }
}

/*
* 登录类日志
* */
export class LoginLogger extends ElkLogger {
  static info(message: any, meta: any = {type: "login"}) {
    super.info(message, meta);
  }

  static error(message: any, meta: any = {type: "login"}) {
    super.info(message, meta);
  }
}

/*
* 授权类日志
* */
export class AuthLogger extends ElkLogger {
  static info(message: any, meta: any = {type: "auth"}) {
    super.info(message, meta);
  }

  static error(message: any, meta: any = {type: "auth"}) {
    super.info(message, meta);
  }
}

/*
* 操作类日志
* */
export class OperateLogger extends ElkLogger {
  static info(message: any, meta: any = {type: "operate"}) {
    super.info(message, meta);
  }

  static error(message: any, meta: any = {type: "operate"}) {
    super.info(message, meta);
  }
}

/*
* 应用类日志
* */
export class AppLogger extends ElkLogger {
  static info(message: any, meta: any = {type: "app"}) {
    super.info(message, meta);
  }

  static error(message: any, meta: any = {type: "app"}) {
    super.info(message, meta);
  }
}

/*
* 应用类日志
* */
export class SQLLogger extends ElkLogger {
  static info(message: any, meta: any = {type: "sql"}) {
    super.info(message, meta);
  }

  static error(message: any, meta: any = {type: "sql"}) {
    super.info(message, meta);
  }
}

/*
* 请求类日志
* */
export class RequestLogger extends ElkLogger {
  static info(message: any, meta: any = {type: "request"}) {
    super.info(message, meta);
  }

  static error(message: any, meta: any = {type: "request"}) {
    super.info(message, meta);
  }
}

/*
* 异常类日志
* */
export class ExceptionLogger extends ElkLogger {
  static info(message: any, meta: any = {type: "exception"}) {
    super.info(message, meta);
  }

  static error(message: any, meta: any = {type: "exception"}) {
    super.info(message, meta);
  }
}

