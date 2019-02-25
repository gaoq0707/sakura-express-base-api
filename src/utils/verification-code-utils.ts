/**
 * 验证码工具类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */
import {RandomUtils} from "./random-utils";
import {CaptchaData} from "../types/interfaces";

let ccap = require("ccap");

export class VerificationCodeUtils {

  /**
   * 生成验证码
   * @returns {CaptchaData}
   */
  static makeVerificationCode(): CaptchaData {
    let captcha = ccap({
      width: 256,
      height: 60,
      offset: 40,
      quality: 50,
      fontsize: 57,
      generate: function () {
        return RandomUtils.randomNum(6);
      }
    });

    let data: any = captcha.get();
    return {
      text: data[0],
      data: data[1]
    };
  }

}