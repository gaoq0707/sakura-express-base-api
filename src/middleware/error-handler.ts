/**
 * 中间件,请求结束后的结果处理
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {NextFunction, Request, Response} from "../base/base-express";
import {RequestUtils} from "../utils/request-utils";
import {RequestParams} from "../types/interfaces";
import {ExceptionLogger, OperateLogger} from "../logger/elk-logger";
import * as os from "os";

/*
* request 日志记录
* 记录内容包含:
* method
* url
*
* */
export function errorHandler(result: any, req: Request, res: Response, next: NextFunction) {
  if (result && result.code < 500) {
    let token: string = RequestUtils.getTokenByReq(req);
    if (token) {
      if (result.code === 400 && result.message === "PARAM_ERROR") {
        let params: RequestParams = RequestUtils.getParamsByReq(req);
        let userInfo: any = req.userInfo;
        OperateLogger.info("parameter error occurred", {
          userId: userInfo.id,
          userName: userInfo.name,
          requestUrl: req.url,
          requestParams: params,
          responseUrl: result
        });
      }
    }
    res.status(result.code).json(result);
  } else {
    ExceptionLogger.info(result.errors[0].message, {url: req.url, parameters: req.body, host: os.hostname()});
    res.status(500).send(`Internal Server Error:\n${result.errors[0].message}`);
  }
  return;

}

