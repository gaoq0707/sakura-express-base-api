/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

let moment = require("moment");

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
