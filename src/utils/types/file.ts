/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as fs from "fs";

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
