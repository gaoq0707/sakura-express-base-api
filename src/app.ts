/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

// package
import * as express from "express";
import {DBClient, SelectQuery} from "sakura-node-3";
// common
import {ApplicationContext} from "./common/applicationcontext";
import {AppLogger} from "./common/logger";
// middleware
import {fetchOptions} from "./middleware/fetch-options";
import {requestLog} from "./middleware/request-log";
import {tokenParseExpect} from "./middleware/token-parse-expect";
import {RequestDad} from "./middleware/request-dad";

// 获取node运行环境
let NODE_ENV: string = process.env.NODE_ENV || "default";
// 获取pm2实例id
let INSTANCE_ID: string = process.env.INSTANCE_ID || "0";
// 记录启动环境日志
AppLogger.info("启动服务,node环境", NODE_ENV, "实例", INSTANCE_ID);
// 初始化运行环境和端口
ApplicationContext.setInstance(ApplicationContext.getInstance().init(NODE_ENV, INSTANCE_ID));
// 启动数据库连接
let client: DBClient = ApplicationContext.setupDatabase();

/*
* 测试数据库连接
* */
let testSQL: SelectQuery = new SelectQuery().select(["id"]).from("policy").where("1=1");
client.query(testSQL).then(function (data) {
  console.log("目前保单数量:", data.rows.length);
})["catch"](function (err) {
  console.log(err);
});

// 获取当前的实例id
let instanceId: number = ApplicationContext.getApplicationInstanceId();
if (instanceId === 0) {
  // 执行定时任务

}

// 设置
const app: express.Application = express();
// 静态文件目录
app.use(express.static("static"));
// 文件上传目录
app.use(express.static("upload"));
// 处理跨域,OPTIONS请求直接返回200
app.use(fetchOptions);
// 排除图标请求
app.use("/favicon.ico", function (req, res) {
  res.end();
});
// 记录请求日志
app.use(requestLog);
// routes
let apiV1: express.Router = require("./routes/api-v1");
let appApiV1: express.Router = require("./routes/app-api-v1");
// 处理不需要过滤权限的route
app.use(tokenParseExpect(["doc", "upload"], [
  "/favicon.ico",
  "/api/v1/users/login",
  "/appapi/v1/users/login",
  "/api/v1/users/getVerificationCode",
  "/appapi/v1/apps/appLog/create",
  "/appapi/v1/appVersions/appVersion/latest",
  "/api/v1/policys/surveyTask/lookSceneReport"
]));
app.use("/api/v1", apiV1);
app.use("/appapi/v1", appApiV1);
app.use("/doc", express.static("document"));

// 所有路由都未匹配（404）
app.get("*", RequestDad.requestDad);
app.post("*", RequestDad.requestDad);
app.put("*", RequestDad.requestDad);
app.delete("*", RequestDad.requestDad);

// listen
let appPort: number = ApplicationContext.getAppConfig().port || 3000;
app.listen(appPort).on("error", (err: Error) => {
  AppLogger.error(`[ picc api error ${ JSON.stringify(err)} ]`);
  process.exit(1);
});

AppLogger.info(`Server start and listen on port ${appPort}`);
