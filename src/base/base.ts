/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as express from "express";

export interface ParsedAsJson {
  body: any;

  [key: string]: any;
}

/**
 * Someday we may migrate to koa or some other RESTful framework, so we give Request/Response a type alias.
 */

export type Request = express.Request & ParsedAsJson;
export type Response = express.Response;
export type NextFunction = express.NextFunction;