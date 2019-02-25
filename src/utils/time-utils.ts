/**
 * 时间工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */
import * as moment from "moment";

export class TimeUtils {

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
   * 格式化时间: 仅返回年月
   * @returns {string}
   */
  static getYearAndMonth(date: string = null): string {
    if (date) {
      let nowDate: Date = new Date(date);
      let month: string = (nowDate.getMonth() + 1).toString();
      if  (nowDate.getMonth() < 9) {
        month = "0" + month;
      }
      return `${nowDate.getFullYear()}${month}`;
    } else {
      let nowDate: Date = new Date();
      let month: string = (nowDate.getMonth() + 1).toString();
      if  (nowDate.getMonth() < 9) {
        month = "0" + month;
      }
      return `${nowDate.getFullYear()}${month}`;
    }
  }

  /**
   * 格式化时间: 将时间戳转化为date
   * @param timeStamp
   * @param isHms
   * @returns {string} YYYY-MM-DD HH:mm:ss
   */
  static getDateByTimeStamp(timeStamp: number, isHms: Boolean = true): string {
    if (isHms) {
      return moment(timeStamp * 1000).format("YYYY-MM-DD HH:mm:ss");
    } else {
      return moment(timeStamp * 1000).format("YYYY-MM-DD");
    }
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
   * 格式化时间: 将Date戳转化为date
   * @param date
   * @returns {string} YYYYMMDDHHmmssffff
   */
  static getDateByDate(date: Date = null): string {
    if (date) {
      return moment(date.getTime()).format("YYYYMMDDHHmmssSSS");
    } else {
      return moment(new Date().getTime()).format("YYYYMMDDHHmmssSSS");
    }
  }

  /**
   * 格式化时间: 将date + N
   * @param date
   * @param days
   * @param isHour
   * @returns {string}
   */
  static addDays(date: string, days: number, isHour: boolean = true): string {
    if (isHour) {
      return moment(date).add(days, "days").format("YYYY-MM-DD");
    } else {
      return moment(date).add(days, "days").format("YYYY-MM-DDTHH:mm:ss+0800");
    }
  }


}