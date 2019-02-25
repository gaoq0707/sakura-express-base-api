/**
 * 中间件,elk请求前日志收集
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */
import {NextFunction, Request, Response} from "../base/base-express";
import {requestLifecycleLoggerBeforeRoute, RequestLifecycleLoggerInitOptions} from "@gago/request-logger";
import {ElkLoggerUtils} from "../utils/elk-logger-utils";

/*
* elk 路由前日志
* */
export function collectRequestLoggerBefore(): (req: Request, res: Response, next: NextFunction) => void {
  // let elkConfig: RequestLifecycleLoggerInitOptions = ElkLoggerUtils.loggerConfig(["userInfo"]);
  let elkConfig: RequestLifecycleLoggerInitOptions = ElkLoggerUtils.loggerConfig();
  return requestLifecycleLoggerBeforeRoute(elkConfig);
}