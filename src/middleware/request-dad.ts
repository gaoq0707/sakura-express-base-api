/**
 * 中间件,请求失败404处理
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {NextFunction, Request, Response} from "../base/base-express";

/*
* request 匹配不到路由 返回404
*
* */
export function requestDad(req: Request, res: Response, next: NextFunction) {
  res.sendStatus(404);
}
