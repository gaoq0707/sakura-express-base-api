/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as crypto from "crypto";
import {Cipher, Decipher} from "crypto";
import {ApplicationContext} from "../../common/application-context";

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
