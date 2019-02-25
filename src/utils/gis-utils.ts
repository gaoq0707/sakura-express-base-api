/**
 * GIS工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */



export class GisUtils {

  /*
   * 获取距离
   * @param lonA
   * @param latA
   * @param lonB
   * @param latB
   * @returns {number}
   */
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

  /*
  * 根据bbox计算scale
  * */
  static calScale(bBox: number[]) {
    let distance: number = this.getDistance(bBox[0], bBox[1], bBox[2], bBox[3]);
    return distance * 10000;
  }

  /**
   * 判断经纬度是否在国内，非精准判断，只判断大概范围
   * @param lat
   * @param lon
   * @returns {boolean}
   */
  static outOfChina(lon: number, lat: number) {
    // return !(lon >= 72.004 && lon <= 137.8347 && lat > 0.8292 && lat < 55.8272);
    return !(lon >= 65 && lon <= 145 && lat > 0.1 && lat < 60);
  }

  /*
   * 获取距离获取level
   * @returns {number}
   */
  static getLevel(distance: number): number {
    let level: number;
    if (distance >= 1000) {
      level = -1;
    } else if (distance >= 300 && distance < 1000) {
      level = 0;
    } else if (distance >= 100 && distance < 300) {
      level = 1;
    } else if (distance > 20 && distance <= 100) {
      level = 2;
    } else {
      level = 3;
    }
    return level;
  }

  /*
   * 根据等级获取level
   * @returns {number}
   */
  static getLevelByZoom(zoom: number): number {
    if (zoom < 6) {
      return -1;
    } else if (zoom >= 6 && zoom < 9) {
      return 0;
    } else if (zoom >= 9 && zoom < 11) {
      return 1;
    } else if (zoom >= 11 && zoom < 13) {
      return 2;
    } else {
      return 3;
    }
  }

}