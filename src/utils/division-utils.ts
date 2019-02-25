/**
 * 行政区划工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

export class DivisionUtils {

  /**
   * 通过level截取code-1
   * @param level
   * @param code
   * @returns {string}
   */
  static substrCode(level: number, code: string | number): string {
    // TODO 行政区划查询方式
    let codeStr: string = code.toString();
    let codeSubstr: string = codeStr;
    if (codeStr !== "-1") {
      if (level === 0) {
        codeSubstr = codeStr.substr(0, 2);
      } else if (level === 1) {
        codeSubstr = codeStr.substr(0, 4);
      } else if (level === 2) {
        codeSubstr = codeStr.substr(0, 6);
      } else if (level === 3) {
        codeSubstr = codeStr.substr(0, 9);
      }
    }
    return codeSubstr;
  }

  /**
   * 通过level截取code-2
   * @param level
   * @param code
   * @returns {string}
   */
  static substrCode2(level: number, code: string): string {
    // TODO 行政区划查询方式
    let codeSubstr: string = code;
    if (level === 0) {
      codeSubstr = code.substr(0, 2);
    } else {
      codeSubstr = code.substr(0, 4);
    }
    return codeSubstr;
  }

  /*
   * 拼接地址
   * */
  static joinAddress(division: any, isSpace: Boolean = true): string {
    let address: Array<string> = [];
    if (division.provinceName) {
      address.push(division.provinceName);
    }
    if (division.cityName) {
      address.push(division.cityName);
    }
    if (division.countyName) {
      address.push(division.countyName);
    }
    if (division.townName) {
      address.push(division.townName);
    }
    if (division.villageName) {
      address.push(division.villageName);
    }
    if (isSpace) {
      return address.join(" ");
    } else {
      return address.join("");
    }
  }

}