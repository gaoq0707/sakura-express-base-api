/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as express from "express";

/*
* request 工具类
* */
export class Request {
  /*
  * 获取当前请求中的token
  * */
  static getTokenByReq(req: express.Request): string {
    try {
      const token: string = req.header("token")
        || req.query["token"]
        || req.body["token"]
        || req.params.token;
      return token;
    } catch (err) {
      return null;
    }
  }

  /*
  * 获取当前请求中的ip地址
  * */
  static getIpByReq(req: express.Request): string | string [] {
    let reqIP: string | string [] = req.headers["x-forwarded-for"]
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.remoteAddress;
    return reqIP;
  }

  /*
  * 获取当前请求中的所有参数
  * */
  static getParamsByReq(req: express.Request): any {
    return Object.assign(req.query, req.params, req.body);
  }
}
