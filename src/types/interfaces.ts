/**
 * 其他的interface
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */


/*
* 验证码
* */
export interface CaptchaData {
  text: string;
  data: Buffer;
}

/*
* 图片验证码信息
* */
export interface ImgCaptcha {
  verificationCode: string;
  img: string;
}


/*
* request params
* */
export interface RequestParams {
  [key: string]: string;
}

/*
* type *
* */
export interface Type {
  [key: string]: string | number | number[] | string[] | {};
}

