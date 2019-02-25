/**
 * 随机数工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */


import * as crypto from "crypto";
import * as uuid from "uuid";
import * as shortId from "shortid";

const genId = require("gen-id")("XX");

export class RandomUtils {

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

  /*
   * 生成uuid随机码
   * @returns {string}
   */
  static getUuid(): string {
    return uuid.v1().split("-").join("");
  }

  /*
  * 生成短id
  * */
  static getShortId() {
    let seed: any = genId.generate();
    return shortId.generate() + (seed ? seed : "");
  }


}
