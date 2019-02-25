/**
 * 中间件,token验证
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {NextFunction, Request, Response} from "../base/base-express";
import {RequestUtils} from "../utils/request-utils";
import {AuthLogger} from "../logger/elk-logger";
import {AuthErrorResponse, ServerErrorResponse} from "../base/base-response";
import {RedisHelper} from "../helper/redis-helper";
import {SystemOpts} from "../types/config-types";
import {ApplicationContext} from "../common/application-context";
import {KeyPrefix} from "../types/enums";
import {TimeUtils} from "../utils/time-utils";
import {ApiError} from "sakura-node-3";

import * as url from "url";

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

    let reqIP: string | string [] = RequestUtils.getIpByReq(req);
    let reqUrl: string = req.url;
    // token validation
    try {
      const token: string = RequestUtils.getTokenByReq(req);
      // 获取不到token
      if (!token) {
        AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ reqUrl }  ${reqIP}`);
        next(AuthErrorResponse.missingAuthToken());
        return;
      }

      let redisHelper: RedisHelper = RedisHelper.getInstance();
      let system: SystemOpts = ApplicationContext.getSystemConfig();
      redisHelper.getDataByKey(KeyPrefix.USER_TOKEN + token).then(function (redisUser: string) {
        if (redisUser) {
          // 当前时间戳秒值
          let nowTime: number = TimeUtils.getTime();
          let userInfo: any = JSON.parse(redisUser);
          req.userInfo = userInfo;
          let tokenTime: number = system.appTokenTime;
          if (reqUrl.split("/")[1] === "appapi") {
            tokenTime = system.apiTokenTime;
          }
          // 如果五天之内没有操作，清楚登陆痕迹
          if (userInfo.lastOperationTime < nowTime - tokenTime) {
            // 清除redis中的用户缓存
            redisHelper.clearDataWithKey(KeyPrefix.USER_TOKEN + token);
            AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ req.url }  ${reqIP}`);
            next(AuthErrorResponse.authRequired());
            return;
          } else {
            // 用户最后操作时间
            userInfo.lastOperationTime = nowTime;
            // 将用户信息保存到redis中,不更新过期时间
            redisHelper.updateDataWithKey(KeyPrefix.USER_TOKEN + token, JSON.stringify(userInfo), tokenTime / 60).then(() => {
              next();
              return;
            });
          }
        } else {
          AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ req.url }  ${reqIP}`);
          next(AuthErrorResponse.authRequired());
          return;
        }
      });
    } catch (err) {
      AuthLogger.info(`MISSING_AUTHORIZATION_TOKEN ${ req.url }  ${reqIP}`);
      next(new ServerErrorResponse(new ApiError("EXCEPTION", err.message), "SERVER_HAPPEN_EXCEPTION"));
      return;
    }
  };
}


