/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

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
