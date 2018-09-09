/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import {Request, Response, NextFunction} from "../base/base";
import {ExceptionLogger} from "../common/logger";
import * as os from "os";

/*
* request 日志记录
* 记录内容包含:
* method
* url
*
* */
export function responseHandler(result: any, req: Request, res: Response, next: NextFunction) {
  if (result && result.code < 500) {
    res.status(result.code).json(result);
  } else {
    console.log(result);
    ExceptionLogger.info(result.errors[0].message, {url: req.url, parameters: req.body, host: os.hostname()});
    res.status(500).send(`Internal Server Error:\n${result.errors[0].message}`);
  }
  return;

}

