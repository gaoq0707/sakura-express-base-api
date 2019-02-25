/**
 * base-express
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import * as express from "express";

/**
 * 扩展express.Request
 * @author gaoqiang@gagogroup.com
 * @version 2.0.0
 */
export interface ParsedAsJson {
  body: any;
  [key: string]: any;
}

/**
 * @description express.Request
 * @author gaoqiang@gagogroup.com
 * @version 2.0.0
 */
export type Request = express.Request & ParsedAsJson;
/**
 * @description express.Response
 * @author gaoqiang@gagogroup.com
 * @version 2.0.0
 */
export type Response = express.Response;
/**
 * @description express.NextFunction
 * @author gaoqiang@gagogroup.com
 * @version 2.0.0
 */
export type NextFunction = express.NextFunction;