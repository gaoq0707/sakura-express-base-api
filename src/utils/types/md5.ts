/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as fs from "fs";
import * as md5 from "md5";
import * as crypto from "crypto";

/*
* md5 工具类
* */
export class MD5 {
  /*
    * 文件md5校验
    * @param file
    * @returns {string}
    * */
  static getMd5Key(file: string): string {
    let md5sum = crypto.createHash("md5");
    let stream = fs.readFileSync(file);
    md5sum.update(stream);
    return md5sum.digest("hex").toUpperCase();
  }

  /*
   * string md5校验
   * @param name
   * @returns {string}
   * */
  static getMd5ByName(name?: string): string {
    return md5(name);
  }
}
