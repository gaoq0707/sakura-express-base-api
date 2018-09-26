/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as redis from "redis";
import * as fs from "fs";
import {DBClient, DriverOptions, DriverType} from "sakura-node-3";
import {ApplicationOpts, DBClientOpts, SystemOpts, UploadPath} from "./types/interfaces";

export class ApplicationContext {
  private static instance: ApplicationContext;

  private static ENV: string; // 系统环境变量NODE_ENV
  private static INSTANCE_ID: number; // pm2启动的实例ID

  init(env: string, instanceId: string): ApplicationContext {
    ApplicationContext.ENV = env;
    ApplicationContext.INSTANCE_ID = Number(instanceId);
    return this;
  }

  static getInstance(): ApplicationContext {
    return this.instance || (this.instance = new this());
  }

  static setInstance(app: ApplicationContext): void {
    this.instance = app;
  }

  static getApplicationENV(): string {
    return ApplicationContext.ENV;
  }

  static getApplicationInstanceId(): number {
    return ApplicationContext.INSTANCE_ID;
  }

  /*
  * 获取配置项
  * */
  static getConfig(): string {
    // 获取note运行环境
    let env: string = this.getApplicationENV();
    return fs.readFileSync(`config/${env}.json`).toString();
  }

  /*
  * 获取应用配置
  * */
  static getAppConfig(): ApplicationOpts {
    return JSON.parse(this.getConfig())["application"];
  }

  /*
  * 获取系统配置
  * */
  static getSystemConfig(): SystemOpts {
    return JSON.parse(this.getConfig())["system"];
  }

  /*
  * 启动数据库连接
  * */
  static setupDatabase(): DBClient {
    let dbClientOpts: DBClientOpts = JSON.parse(this.getConfig())["database"]["mysql"];

    const driverOptions: DriverOptions = {
      type: DriverType.MYSQL,
      username: dbClientOpts.username,
      password: dbClientOpts.password, // Utils.decipherDatabase(password),
      database: dbClientOpts.databaseName,
      host: dbClientOpts.host,
      port: dbClientOpts.port
    };

    return DBClient.createClient(driverOptions);
  }

  /*
  * 获取redis配置
  * */
  static getRedisConfig(): redis.ClientOpts {
    return JSON.parse(this.getConfig())["database"]["redis"];
  }

  /*
  * 获取上传文件夹目录
  * */
  static getUploadPathConfig(): UploadPath {
    return {
      survey : JSON.parse(this.getConfig())["uploadPath"]["survey"]
    };
  }

}


