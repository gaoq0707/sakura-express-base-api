/**
 * 文件工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */


import * as fs from "fs";
import * as process from "child_process";

import {RandomUtils} from "./random-utils";
let format = require("string-format");
let phantom = require("phantom");
let images = require("gago-images");
let xlsx = require("node-xlsx");
let qr = require("qr-image");

export class FileUtils {

  /*
  * 按照时间（2018/09/10/09）创建文件夹结构，默认创建到小时级别
  * */
  static makeDateDir(baseDir: string): string {
    FileUtils.makeDir(baseDir);
    let date: Date = new Date();
    baseDir += `/${date.getFullYear()}`;
    // 按照年份创建文件夹
    FileUtils.makeDir(baseDir);
    // 按照月份创建文件夹(月份+1)
    baseDir += `/${(date.getMonth() + 1)}`;
    FileUtils.makeDir(baseDir);
    // 按照日期创建文件夹
    baseDir += `/${date.getDate()}`;
    FileUtils.makeDir(baseDir);
    // 按照小时创建文件夹
    baseDir += `/${date.getHours()}`;
    FileUtils.makeDir(baseDir);

    return baseDir;
  }

  /*
  * 按照时间（2018/09/10）创建文件夹结构，默认创建到天级别
  * */
  static makeDateDirToDay(baseDir: string): string {
    FileUtils.makeDir(baseDir);
    let date: Date = new Date();
    baseDir += `/${date.getFullYear()}`;
    // 按照年份创建文件夹
    FileUtils.makeDir(baseDir);
    // 按照月份创建文件夹(月份+1)
    baseDir += `/${(date.getMonth() + 1)}`;
    FileUtils.makeDir(baseDir);
    // 按照日期创建文件夹
    baseDir += `/${date.getDate()}`;
    FileUtils.makeDir(baseDir);

    return baseDir;
  }

  /*
 * 合并图片 (文件路径)
 * */
  static mergePicture(bottomPic: string, topPic: string, outPic: string, width: number = 400, height: number = 400): void {
    images(bottomPic)
      .size(width, height)
      .draw(images(topPic), 0, 0)
      .save(outPic, {quality: 100});
  }

  /*
  * 合并图片 (文件buffer)
  * */
  static mergePictureBuffer(bottomPicBuffer: Buffer, topPicBuffer: Buffer, outPic: string, width: number = 400, height: number = 400): void {
    images(bottomPicBuffer)
      .size(width, height)
      .draw(images(topPicBuffer), 0, 0)
      .save(outPic, {quality: 100});
  }

  /*
   * 读取文件
   * */
  static readFile(file: string): Buffer {
    return fs.readFileSync(file);
  }

  /*
  * 创建文件夹,如果不存在目录就创建
  * */
  static makeDir(dir: string): void {
    let exists: boolean = this.existsSync(dir);
    if (!exists) {
      fs.mkdirSync(dir);
    }
  }

  /*
  * 判断文件夹是否存在
  * */
  static existsSync(dir: string): boolean {
    return fs.existsSync(dir);
  }

  /*
  * 重命名文件
  * */
  static reName(oldName: string, newName: string): void {
    fs.renameSync(oldName, newName);
  }

  /*
  * 删除文件
  * */
  static deleteFile(file: string): void {
    fs.unlink(file, function () {});
  }

  /*
  * 读取文件夹下所有文件
  * */
  static readNextFile(path: string): Array<string> {
    return fs.readdirSync(path);
  }

  /*
  * 合并pdf
  * */
  static async mergePdf(outPdfFile: string, inPdfFiles: Array<string>): Promise<any> {
    let cmd: string = `/usr/bin/gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=${outPdfFile} ${inPdfFiles.join(" ")}`;
    await process.execSync(cmd);
    for (let inPdfFile of inPdfFiles) {
      this.deleteFile(inPdfFile);
    }
  }

  /*
  * 压缩文件
  * */
  static async zipFile(outFile: string, inFiles: Array<string>): Promise<any> {
    let cmd: string = `/usr/bin/zip -j -D ${outFile} ${inFiles.join(" ")}`;
    await process.execSync(cmd);
  }

  /*
  * 创建html by text
  * */
  static async mkdirHtml(data: any, templateHtml: string, dirPath: string): Promise<string> {
    // 按照日期创建文件夹层级
    let fileNewDir: string = this.makeDateDir(dirPath);
    // 新文件夹名称
    let htmlFile: string = `${fileNewDir}/${RandomUtils.getUuid()}.html`;
    let readFileText: Buffer = fs.readFileSync(templateHtml);
    let writeFileText: string = format(readFileText.toString(), data);
    fs.writeFileSync(htmlFile, writeFileText);
    return htmlFile;
  }

  /**
   * 写xlsx
   * @param file
   * @param datas
   * @returns {Boolean}
   */
  static writeXlsx(file: string, datas: Array<any>): Boolean {
    let buffer = xlsx.build([{
      name: "sheet1",
      data: datas
    }]);
    fs.writeFileSync(file, buffer, {
      "flag": "w"
    });
    return true;
  }

  /*
  * 读取xlsx
  * */
  static readXlsx(file: string): any {
    return xlsx.parse(file);
  }

  /*
  * 通过url生成二维码
  * */
  static async getQrImage(uri: string, imgName: string): Promise<void> {
    let qrPng: any = qr.image(uri, {type: "png", size : 10});
    await qrPng.pipe(fs.createWriteStream(imgName));
  }

  /*
  * 获取文件大小
  * */
  static getFileSize(file: string): number {
    let stateInfo: any = fs.statSync(file);
    return stateInfo.size;
  }

  /*
  * 是否是文件
  * */
  static isFile(file: string): number {
    let stateInfo: any = fs.statSync(file);
    return stateInfo.isFile();
  }

  /**
   * 判断文件格式
   * @param fileType 文件类型
   * @param type 如果不传,默认判断是否为图片
   */
  static async isFileFormat(fileType: string, type: string = null): Promise<boolean> {
    fileType = fileType.toLowerCase();
    let result: boolean = true;
    if (type) {
      if (fileType !== type) {
        result = false;
      }
    } else {
      if (fileType !== "png" && fileType !== "gif" && fileType !== "jpeg" && fileType !== "jpg") {
        result = false;
      }
    }
    return result;
  }

}