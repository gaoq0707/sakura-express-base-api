/**
 * md5工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import * as crypto from "crypto";
import * as express from "express";
import * as fs from "fs";
import * as md5 from "md5";
import * as uuid from "uuid";
import {CaptchaData, RequestParams} from "../types/interfaces";
import {FileUtils} from "./file-utils";


export class Md5Utils {

  /*
   * 文件md5校验
   * @param file
   * @returns {string}
   */
  static getMd5Key(file: string): string {
    let md5sum = crypto.createHash("md5");
    let stream = FileUtils.readFile(file);
    md5sum.update(stream);
    return md5sum.digest("hex").toUpperCase();
  }

  /*
   * string md5校验
   * @param name
   * @returns {string}
   */
  static getMd5ByName(name?: string): string {
    return md5(name);
  }

}