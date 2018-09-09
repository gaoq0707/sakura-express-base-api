/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as url from "url";
import {AuthLogger} from "../common/logger";
import {Request, Response, NextFunction} from "../base/base";
import {RedisHelper} from "../helper/redishelper";
import {ParamsErrorResponse, ServerErrorResponse, BadRequestResponse, AuthErrorResponse} from "../base/baseresponse";
import {utils} from "../common/utils";
import {ApiError, HttpResponse} from "sakura-node-3";
import {RedisKeyPrefix} from "../common/types/enums";

/*
* token过滤,需验证redis
* @params exceptionsRoute:排除的路由,如doc/upload等
* @params exceptionsArr:排除的请求,如登录,获取验证码等
* */
export function tokenParseExpect(exceptionsRoute: string[], exceptionsArr: string[]): (req: Request, res: Response, next: NextFunction) => void {
  return function (req: Request, res: Response, next: NextFunction): void {
    let pathname: string = url.parse(req.url).pathname;
    let paths: string[] = pathname.split("/");
    if (paths.length > 2) {
      for (let route of exceptionsRoute) {
        if (route === paths[1]) {
          next();
          return;
        }
      }
    }
    for (let exception of exceptionsArr) {
      if (exception === pathname) {
        next();
        return;
      }
    }

    let reqIP: string | string [] = utils.Request.getIpByReq(req);
    // token validation
    try {
      const token: string = utils.Request.getTokenByReq(req);
      // 获取不到token
      if (!token) {
        AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ req.url }  ${reqIP}`);
        res.status(401).json({
          error: {
            code: 401,
            message: "AUTH_MISSING_TOKEN"
          }
        });
        return;
      }

      let redisHelper: RedisHelper = RedisHelper.getInstance();
      redisHelper.getDataByKey(RedisKeyPrefix.USER_TOKEN + token).then(function (redisUser: string) {
        if (redisUser) {
          // 当前时间戳秒值
          let nowTime: number = utils.Time.getTime();
          let userInfo: any = JSON.parse(redisUser);
          // 如果五天之内没有操作，清楚登陆痕迹
          if (userInfo.lastOperaotionTime < nowTime - 7776000) {
            // 清除redis中的用户缓存
            redisHelper.clearDataWithKey(RedisKeyPrefix.USER_TOKEN + token);
            AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ req.url }  ${reqIP}`);
            res.status(401).json({
              error: {
                code: 401,
                message: "AUTH_REQUIRED_ERROR"
              }
            });
            return;
          } else {
            // 用户最后操作时间
            userInfo.lastOperaotionTime = nowTime;
            // 将用户信息保存到redis中,不更新过期时间
            redisHelper.updateDataWithKey(RedisKeyPrefix.USER_TOKEN + token, JSON.stringify(userInfo)).then(() => {
              next();
              return;
            });
          }
        } else {
          AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ req.url }  ${reqIP}`);
          res.status(401).json({
            error: {
              code: 401,
              message: "AUTH_REQUIRED_ERROR"
            }
          });
          return;
        }
      });
    } catch (err) {
      AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ req.url }  ${reqIP}`);
      res.status(500).json({
        error: {
          code: 500,
          message: "SERVER_HAPPEN_EXCEPTION",
          errors: new ApiError("EXCEPTION", err.message)
        }
      });
      return;
    }
  };
}
