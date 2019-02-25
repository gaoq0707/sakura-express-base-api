/**
 * request辅助类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */


import {RequestParams} from "../types/interfaces";

import {Request} from "express";

export class RequestUtils {

  /*
  * 获取当前请求中的token
  * */
  static getTokenByReq(req: Request): string {
    try {
      return req.header("token")
        || req.query["token"]
        || req.body["token"]
        || req.params.token;
    } catch (err) {
      return null;
    }
  }

  /*
  * 获取当前请求中的ip地址
  * */
  static getIpByReq(req: Request): string | string [] {
    return req.headers["x-forwarded-for"]
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.remoteAddress;
  }

  /*
  * 获取当前请求中的所有参数
  * */
  static getParamsByReq(req: Request): RequestParams {
    return Object.assign(req.query, req.params, req.body);
  }

}