/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import {Request, Response, NextFunction} from "../base/base";
import {RequestLogger} from "../common/logger";
import {utils} from "../common/utils";

/*
* request 日志记录
* 记录内容包含:
* method
* url
*
* */
export function requestLog(req: Request, res: Response, next: NextFunction) {

  let params: any = utils.Request.getParamsByReq(req);
  let reqIP: string | string [] = utils.Request.getIpByReq(req);
  if (req.url !== "/favicon.ico" && req.method !== "head") {
    RequestLogger.info(`[${req.method.toString()}]  ${req.url} from ${reqIP}, body: ${JSON.stringify(params)}`);
  }
  next();
  return;
}

