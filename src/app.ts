/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

// package
import * as express from "express";
import * as timeout from "connect-timeout";
import * as bodyParser from "body-parser";
// common
import {ApplicationContext} from "./common/application-context";
// middleware
import {fetchOptions} from "./middleware/fetch-options";
import {requestLog} from "./middleware/request-log";
import {tokenParseExpect} from "./middleware/token-parse-expect";
import {NextFunction} from "./base/base-express";
import {BadRequestResponse} from "./base/base-response";
import {requestTimeout} from "./middleware/request-timeout";
import {requestDad} from "./middleware/request-dad";
import {AppLogger} from "./logger/elk-logger";



// 获取node运行环境
let NODE_ENV: string = process.env.NODE_ENV || "default";
// 获取pm2实例id
let INSTANCE_ID: string = process.env.INSTANCE_ID || "0";
// 初始化运行环境和端口
ApplicationContext.setInstance(ApplicationContext.getInstance().init(NODE_ENV, INSTANCE_ID));

// 获取当前的实例id
let instanceId: number = ApplicationContext.getApplicationInstanceId();
if (instanceId === 0) {
  // 执行定时任务

}

// 设置
const app: express.Application = express();

// -------------------------------------------------------------------------
// Middleware (Before)
// -------------------------------------------------------------------------

// 静态文件目录
app.use(express.static("static"));
// 文件上传目录
app.use(express.static("upload"));
// 设置超时时间
app.use(timeout("600s"));
// 跨域快速返回
app.use(fetchOptions);
// 处理超时
app.use(requestTimeout);
// for parsing application/json
app.use(bodyParser.json({limit: "10mb"}));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// invalid JSON
// @ts-ignore
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    next(new BadRequestResponse("Invalid JSON"));
  }
});
// request log
app.use(requestLog);

// -------------------------------------------------------------------------
// Router List
// -------------------------------------------------------------------------

// favicon.ico
app.use("/favicon.ico", function (req, res) {
  res.end();
});

// 服务存活状态监控
app.use("/health", function (req, res) {
  res.status(200);
  res.end();
});
// 处理不需要过滤权限的route
app.use(tokenParseExpect([], []));

let apiV1: express.Router = require("./routes/api-v1");
app.use("/api/v1", apiV1);

// 所有路由都未匹配（404）
app.use("*", requestDad);

// listen
let appPort: number = ApplicationContext.getApplicationPort() || 3000;
app.listen(appPort).on("error", (err: Error) => {
  AppLogger.error(`[ api error ${ JSON.stringify(err)} ]`);
  process.exit(1);
});

AppLogger.info(`Server start and listen on port ${appPort}`);
