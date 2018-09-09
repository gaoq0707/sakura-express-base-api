/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import * as redis from "redis";
import {ApplicationContext} from "../common/applicationcontext";

/*
* Redis辅助类
* */
export class RedisHelper {
  private static instance_: RedisHelper;
  private redisClient_: redis.RedisClient;

  constructor() {
    this.redisClient_ = redis.createClient(ApplicationContext.getRedisConfig());
  }

  static getInstance(): RedisHelper {
    if (!RedisHelper.instance_) {
      RedisHelper.instance_ = new RedisHelper();
    }
    return RedisHelper.instance_;
  }

  static setInstance(instance: RedisHelper): void {
    RedisHelper.instance_ = instance;
  }

  getClient(): redis.RedisClient {
    return this.redisClient_;
  }

  /*
  * 根据key读取数据
  * @author gaoqiang@gagogroup.com
  * */
  async getDataByKey(key: string): Promise<string> {
    return new Promise<string>(((resolve: (value: string) => void, reject: (error?: any) => void) => {
      this.redisClient_.get(key, function (err: Error | void, reply: string) {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    }));
  }
  /*
  * 根据key保存数据
  * @author gaoqiang@gagogroup.com
  * */
  async setDataWithKey(key: string, content: string, expiredMinutes: number = 60): Promise<void> {
    this.redisClient_.set(key, content, function (err: Error | void, reply: string) {
      if (err) {
        throw err;
      } else {
        return;
      }
    });

    this.redisClient_.expireat(key, RedisHelper.getExpiredTimestamp_(expiredMinutes));
  }

  /*
  * 根据key保存10分钟数据
  * @author zhangpanlong@gagogroup.com
  * */
  async setexDataWithKey(key: string, content: string, expiredMinutes: number = 60, seconds: number = 600): Promise<void> {
    this.redisClient_.setex(key, seconds, content, function (err: Error | void, reply: string) {
      if (err) {
        throw err;
      } else {
        return;
      }
    });

    this.redisClient_.expireat(key, RedisHelper.getExpiredTimestamp_(expiredMinutes));
  }

  /*
  * 更新数据
  * @author gaoqiang@gagogroup.com
  * */
  async updateDataWithKey(key: string, content: string): Promise<void> {
    this.redisClient_.set(key, content, function (err: Error | void, reply: string) {
      if (err) {
        throw err;
      } else {
        return;
      }
    });
  }
  /*
  * 清除数据
  * @author gaoqiang@gagogroup.com
  * */
  async clearDataWithKey(key: string): Promise<void> {
    this.redisClient_.del(key, function (err) {
      if (err) {
        throw err;
      } else {
        return;
      }
    });
  }

  /*
  * 过期时间:当前时间+x分
  * @author gaoqiang@gagogroup.com
  * */
  private static getExpiredTimestamp_(minute: number): number {
    let today: Date = new Date();
    today.setMinutes(today.getMinutes() + minute);
    return Math.floor(today.getTime() / 1000);
  }

}
