/**
 * 枚举
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

/*
* redis key 前缀
* */
export enum KeyPrefix {
  USER_TOKEN = "picc:token:",
  ARCGIS_TOKEN = "picc:agstoken:",
  VERIFICATION_CODE = "picc:verification:",
  SMS_VERIFICATION_CODE = "picc:sms:verification:",
  DIVISION = "picc:division:",
  CUSTOMER = "picc:customer:",
  API_MONITOR = "picc:monitor:",
  MICRO_SERVICE = "picc:service:"
}

/*
* 跟踪日志类型
* */
export enum TrackLoggerType {
  LOGIN = "login:",
  AUTH = "auth:",
  OPERATE = "operate:",
  APP = "app:"
}
