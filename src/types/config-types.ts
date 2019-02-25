/**
 * 配置文件中的interface
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */


export interface SystemOpts {
  appTokenTime: number;
  apiTokenTime: number;
  encrypKey: string;
}


export interface ELKOpts {
  host: string;
  port: string;
}