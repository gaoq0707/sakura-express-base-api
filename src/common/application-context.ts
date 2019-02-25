/**
 * application启动辅助类
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */


import * as redis from "redis";
import * as fs from "fs";
import * as path from "path";
import {DBClient, DriverOptions, DriverType} from "sakura-node-3";
import {ELKOpts, SystemOpts} from "../types/config-types";

export class ApplicationContext {
  private static instance: ApplicationContext;

  private static ENV: string; // 系统环境变量NODE_ENV
  private static INSTANCE_ID: number; // pm2启动的实例ID
  private static PORT: number; // node的端口号

  /**
   * 初始化
   * @param env 环境类型
   * @param port 服务端口
   * @param instanceId  实例ID
   */
  init(env: string, instanceId: string): ApplicationContext {
    let config: any = ApplicationContext.getConfig();

    ApplicationContext.ENV = env;
    ApplicationContext.PORT = Number(config["application"]["port"]);
    ApplicationContext.INSTANCE_ID = Number(instanceId);

    console.info(`启动服务,node环境${env},端口${ApplicationContext.PORT},实例${instanceId}`);
    return this;
  }

  /**
   * 单例模式 get实例
   */
  static getInstance(): ApplicationContext {
    return this.instance || (this.instance = new this());
  }

  /**
   * 单例模式 set实例
   * @param app 实例
   */
  static setInstance(app: ApplicationContext): void {
    this.instance = app;
  }

  /**
   * 获取当前运行环境
   */
  static getApplicationENV(): string {
    return ApplicationContext.ENV;
  }

  /**
   * 获取系统当前端口号
   */
  static getApplicationPort(): number {
    return ApplicationContext.PORT;
  }

  /**
   * 获取当前运行的实例ID
   */
  static getApplicationInstanceId(): number {
    return ApplicationContext.INSTANCE_ID;
  }

  /**
   * 获取配置文件中的配置内容
   */
  static getConfig(): any {
    // 获取node运行环境
    let env: string = this.getApplicationENV();
    let configFilePath: string = path.normalize(`config/${env}.json`);
    return JSON.parse(fs.readFileSync(configFilePath).toString());
  }

  /*
  * 启动数据库连接,mysql
  * */
  static setupDatabase(): DBClient {
    let config: any = this.getConfig();
    let dbConfig: any = config["database"]["mysql"];
    let driverOptions: DriverOptions = {
      type: DriverType.MYSQL,
      username: dbConfig["username"],
      password: dbConfig["password"],
      database: dbConfig["databaseName"],
      host: dbConfig["host"],
      port: dbConfig["port"]
    };
    return DBClient.createClient(driverOptions);
  }

  /*
  * 获取redis配置
  * */
  static getRedisConfig(): redis.ClientOpts {
    let config: any = this.getConfig();
    return config["database"]["redis"];
  }

  /*
    * 获取系统配置
    * */
  static getSystemConfig(): SystemOpts {
    let config: any = this.getConfig();
    let systemOpts: SystemOpts = {
      appTokenTime: Number(config["system"]["appTokenTime"]),
      apiTokenTime: Number(config["system"]["apiTokenTime"]),
      encrypKey: config["system"]["encrypKey"]
    };
    return systemOpts;
  }

  /*
  * 获取日志分析的配置
  * */
  static getELKConfig(): ELKOpts {
    let config: any = this.getConfig();

    let host: string = config["elk"]["host"];
    let port: string = config["elk"]["port"];

    return {host, port};
  }

}


