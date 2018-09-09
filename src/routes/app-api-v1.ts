/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as express from "express";
import * as timeout from "connect-timeout";
import * as bodyParser from "body-parser";
import {corsAllowAll, haltOnTimedout, ApiError} from "sakura-node-3";
import {Request, Response, NextFunction} from "../base/base";
import {ParamsErrorResponse} from "../base/baseresponse";
import {tokenParseExpect} from "../middleware/token-parse-expect";
import {responseHandler} from "../middleware/response-handler";

let v1: express.Router = express.Router();

// -------------------------------------------------------------------------
// Middleware (Before)
// -------------------------------------------------------------------------

v1.use(timeout("600s"));
v1.use(corsAllowAll());
v1.use(haltOnTimedout);
v1.use(bodyParser.json({limit: "10mb"})); // for parsing application/json
v1.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// invalid JSON
v1.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    next(new ParamsErrorResponse([new ApiError("INVALID_JSON", error.message)]));
  }
});
// 处理不需要过滤权限的route
v1.use(tokenParseExpect([], [
  "/favicon.ico",
  "/users/login"
]));

// -------------------------------------------------------------------------
// Route List
// -------------------------------------------------------------------------



// -------------------------------------------------------------------------
// Middleware (After)
// -------------------------------------------------------------------------

v1.use(responseHandler); // error handler

module.exports = v1;
