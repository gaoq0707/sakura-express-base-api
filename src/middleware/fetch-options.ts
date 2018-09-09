/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import {Request, Response, NextFunction} from "../base/base";

export function fetchOptions(req: Request, res: Response, next: NextFunction) {
  let reqAny: any = req.headers;
  res.header("Access-Control-Allow-Origin", reqAny.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "x-requested-with, accept, origin, Content-Type, token, Accept, userToken");
  res.header("Access-Control-Expose-Headers", "userToken");
  res.header("X-Powered-By", " 3.2.1");
  // res.header("Content-Type", "application/json;charset=utf-8");
  res.header("P3P", "CP=CAO PSA OUR");
  /*让options请求快速返回*/
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  else {
    next();
  }
}