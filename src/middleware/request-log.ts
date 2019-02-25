/**
 * 中间件,请求的request日志处理
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {RequestLogger} from "../logger/elk-logger";
import {RequestParams} from "../types/interfaces";
import {RequestUtils} from "../utils/request-utils";
import {Request, Response, NextFunction} from "../base/base-express";

/*
* request 日志记录
* 记录内容包含:
* method
* url
*
* */
export function requestLog(req: Request, res: Response, next: NextFunction) {
  let params: RequestParams = RequestUtils.getParamsByReq(req);
  let reqIP: string | string [] = RequestUtils.getIpByReq(req);
  if (req.url !== "/favicon.ico" && req.method !== "head") {
    RequestLogger.info(`[${req.method.toString()}] ${req.url} from ${reqIP}`, {
      url: req.url,
      fromIP: reqIP,
      body: JSON.stringify(params)
    });
  }
  next();
  return;
}

