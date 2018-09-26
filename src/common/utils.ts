/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as express from "express";
import * as fs from "fs";
import * as uuid from "uuid";
import * as md5 from "md5";
import * as crypto from "crypto";
import {Cipher, Decipher} from "crypto";
import {ApplicationContext} from "./application-context";

let moment = require("moment");

export namespace utils {
  /*
  * 文件工具类
  * */
  export class File {
    /*
     * 读取文件
     * */
    static readFile(file: string): Buffer {
      return fs.readFileSync(file);
    }

    /*
    * 按照时间创建文件夹结构，默认创建到小时级别
    * */
    static makeDateDir(baseDir: string): string {
      let date: Date = new Date();
      baseDir += `/${date.getFullYear()}`;
      // 按照年份创建文件夹
      File.makeDir(baseDir);
      // 按照月份创建文件夹(月份+1)
      baseDir += `/${(date.getMonth() + 1)}`;
      File.makeDir(baseDir);
      // 按照日期创建文件夹
      baseDir += `/${date.getDate()}`;
      File.makeDir(baseDir);
      // 按照小时创建文件夹
      baseDir += `/${date.getHours()}`;
      File.makeDir(baseDir);

      return baseDir;
    }

    /*
    * 创建文件夹,如果不存在目录就创建
    * */
    static makeDir(dir: string): void {
      let exists: boolean = fs.existsSync(dir);
      if (!exists) {
        fs.mkdirSync(dir);
      }
    }
  }

  /*
  * 密码工具类
  * */
  export class Password {
    /**
     * aes加密
     * @param data 待加密内容
     * @returns {string}
     */
    static encryption(data: string): string {
      let encrypKey: string = ApplicationContext.getSystemConfig().encrypKey;
      let cipher: Cipher = crypto.createCipheriv("aes-256-ecb", encrypKey, "");
      cipher.setAutoPadding(true);
      let cipherChunks: any = [];
      cipherChunks.push(cipher.update(data, "utf8", "base64"));
      cipherChunks.push(cipher.final("base64"));
      return cipherChunks.join("");
    }

    /**
     * aes解密
     * @param data 待解密内容
     * @returns {string}
     */
    static decryption(data: string): string {
      if (!data) {
        return "";
      }
      try {
        let encrypKey: string = ApplicationContext.getSystemConfig().encrypKey;
        let cipherChunks: any = [];
        let decipher: Decipher = crypto.createDecipheriv("aes-256-ecb", encrypKey, "");
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data, "base64", "utf8"));
        cipherChunks.push(decipher.final("utf8"));
        return cipherChunks.join("");
      }
      catch (err) {
        return "";
      }
    }

    /*
   * 生成用户密码加密使用的盐
   */
    static salt(): string {
      return crypto.randomBytes(16).toString("hex");
    }

    /*
    * 使用sha512加盐对密码进行加密
    * */
    static encryptPassword(salt: string, password: string): string {
      return crypto.pbkdf2Sync(password, salt, 100, 20, "sha512").toString("hex");
    }

  }

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

  /*
  * request 工具类
  * */
  export class Request {
    /*
    * 获取当前请求中的token
    * */
    static getTokenByReq(req: express.Request): string {
      try {
        const token: string = req.header("token")
          || req.query["token"]
          || req.body["token"]
          || req.params.token;
        return token;
      } catch (err) {
        return null;
      }
    }

    /*
    * 获取当前请求中的ip地址
    * */
    static getIpByReq(req: express.Request): string | string [] {
      let reqIP: string | string [] = req.headers["x-forwarded-for"]
        || req.connection.remoteAddress
        || req.socket.remoteAddress
        || req.connection.remoteAddress;
      return reqIP;
    }

    /*
    * 获取当前请求中的所有参数
    * */
    static getParamsByReq(req: express.Request): any {
      return Object.assign(req.query, req.params, req.body);
    }
  }

  /*
  * GIS 工具类
  * */
  export class GIS {
    /*
     * 判断经纬度是否在国内，非精准判断，只判断大概范围
     * @param lat
     * @param lon
     * @returns {boolean}
     * */
    static outOfChina(lon: number, lat: number) {
      // return !(lon >= 72.004 && lon <= 137.8347 && lat > 0.8292 && lat < 55.8272);
      return !(lon >= 65 && lon <= 145 && lat > 0.8 && lat < 60);
    }

    /*
     * 获取距离
     * @param lonA
     * @param latA
     * @param lonB
     * @param latB
     * @returns {number}
     * */
    static getDistance(lonA: number, latA: number, lonB: number, latB: number): number {
      // 6378.137为地球半径，单位为千米；
      let EARTH_RADIUS: number = 6378.137;
      let radLatA: number = latA * Math.PI / 180.0;
      let radLatB: number = latB * Math.PI / 180.0;
      let a: number = radLatA - radLatB;
      let b: number = lonA * Math.PI / 180.0 - lonB * Math.PI / 180.0;
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatA) * Math.cos(radLatB) * Math.pow(Math.sin(b / 2), 2)));
      return Math.round(s * EARTH_RADIUS * 1000) / 1000;
    }
  }

  /*
  * 时间工具类
  * */
  export class Time {
    /**
     * 获取时间戳 10位，秒级
     * @returns {number}
     */
    static getTime(date: string = null) {
      if (date) {
        return Math.round(new Date(date).getTime() / 1000);
      } else {
        return Math.round(new Date().getTime() / 1000);
      }
    }

    /**
     * 格式化时间: 将时间戳转化为date
     * @param timeStamp
     * @returns {string} YYYY-MM-DD HH:mm:ss
     */
    static getDateByTimeStamp(timeStamp: number): string {
      return moment(timeStamp * 1000).format("YYYY-MM-DD HH:mm:ss");
    }

    /**
     * 格式化时间: 将时间戳转化为date
     * @param timeStamp
     * @returns {string} YYYYMMDDHHmmss
     */
    static getUnsignedDateByTimeStamp(timeStamp: number): string {
      return moment(timeStamp * 1000).format("YYYYMMDDHHmmss");
    }

    /**
     * 格式化时间: 将date + N
     * @param date
     * @param days
     * @returns {string}
     */
    static addDays(date: string, days: number): string {
      return moment(date).add(days, "days").format("YYYY-MM-DD");
    }
  }

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
}
