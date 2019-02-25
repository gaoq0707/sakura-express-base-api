/**
 * 字符串工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

export class StrUtils {

  /**
   * 获取时间戳 10位，秒级
   * @returns {number}
   */
  static initialsToUpper(str: string) {
    let tempStr: string = str.toLowerCase();
    if (tempStr.indexOf("_") > 0) {
      let ss: string[] = tempStr.split("_");
      tempStr = ss[0];
      for (let i = 1; i < ss.length; i++) {
        tempStr += ss[i].substr(0, 1).toUpperCase() + ss[i].substr(1, ss[i].length - 1);
      }
    }
    return tempStr;
  }
}