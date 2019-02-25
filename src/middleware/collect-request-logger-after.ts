/**
 * 中间件,elk请求后日志收集
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {Request} from "../base/base-express";
import * as express from "express";
import {requestLifecycleLoggerAfterRoute} from "@gago/request-logger";

/*
* elk 路由后日志
* */
export function collectRequestLoggerAfter(): (err: any, req: Request, res: express.Response, next: express.NextFunction) => void {
  return requestLifecycleLoggerAfterRoute;
}