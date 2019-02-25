/**
 * elk日志工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */


import {DBClient} from "sakura-node-3";
import {
  injectSqlLoggerIntoSakuraDBClient,
  requestLifecycleLogger,
  RequestLifecycleLoggerInitOptions
} from "@gago/request-logger";
import {TrackLoggerType} from "../types/enums";
import {Request} from "../base/base-express";
import {ApplicationContext} from "../common/application-context";
import {ELKOpts} from "../types/config-types";

export class ElkLoggerUtils {

  /*
  * 日志初始化配置
  * */
  static loggerConfig(additionalReqField: string[] = []): RequestLifecycleLoggerInitOptions {
    let elkOpts: ELKOpts = ApplicationContext.getELKConfig();
    let port: number = ApplicationContext.getApplicationPort();
    let instance: number = ApplicationContext.getApplicationInstanceId();
    let env: string = ApplicationContext.getApplicationENV();
    let serviceName: string = "app";
    let config: RequestLifecycleLoggerInitOptions = {
      host: elkOpts.host,
      port: elkOpts.port,
      appId: String(port),
      appName: `${serviceName}:${port}:${env}[${instance}]`,
      additionalReqField
    };
    console.log("log4js=>logstash:", instance, env, serviceName);

    requestLifecycleLogger.config(config);
    return config;
  }

  /**
   * 收集普通日志
   * @returns {number}
   */
  static collectLogger(level: "info" | "error", message: any, meta: any = {}) {
    requestLifecycleLogger.sendLog(level, message, meta);
  }

  /**
   * 收集sql日志
   * @returns {number}
   */
  static collectSqlLogger() {
    injectSqlLoggerIntoSakuraDBClient(DBClient.getClient());
  }


  /**
   * 收集track日志
   * @returns {number}
   */
  static collectTrackLogger(req: Request, trackType: TrackLoggerType, message: string) {
    requestLifecycleLogger.trace(req.traceId, trackType + message);
  }


}