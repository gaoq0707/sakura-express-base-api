/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as uuid from "uuid";
import * as crypto from "crypto";

/*
* 随机值工具类
* */
export class Random {
  /*
   * 生成uuid随机码
   * @returns {string}
   * */
  static getUuid(): string {
    return uuid.v1().split("-").join("");
  }

  /*
  * 生成随机值 token
  * */
  static generateToken() {
    return crypto.randomBytes(36).toString("hex");
  }

  /*
  * 生成随机数,只有数字
  * */
  static randomNum(size: number): string {
    let num: string = "0123456789";
    size = size || 6;
    let no_: string = "";
    for (let i: number = 0; i < size; ++i) {
      no_ += num.charAt(Math.random() * num.length);
    }
    return no_;
  }

  /*
  * 生成字符串,包含数字字母
  * */
  static randomStr(size: number): string {
    let str: string = "234579WERUPASFGHKZXCNM";   // 22个
    size = size || 4;
    let s_: string = "";
    for (let i: number = 0; i < size; ++i) {
      s_ += str.charAt(Math.random() * str.length);
    }
    return s_;
  }
}
