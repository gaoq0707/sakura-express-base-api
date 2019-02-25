/**
 * 中间件,请求超时处理
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {NextFunction, Request, Response} from "../base/base-express";

/*
* request 超时
*
* */
export function requestTimeout(req: Request, res: Response, next: NextFunction) {
  if (!req.timedout) next();
}
