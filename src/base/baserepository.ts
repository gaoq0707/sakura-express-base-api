/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import {GGModel, SelectQuery, InsertQuery, UpdateQuery, sqlContext, SqlField, DeleteQuery} from "sakura-node-3";
import {DBClient, MySqlQueryBuilder, QueryResult} from "sakura-node-3";
import {SQLLogger} from "../common/logger";

interface PrimaryKey {
  sqlPrimaryKey: string;
  modelPrimaryKey: string;
}

/**
 * Repository for handling all CURD.
 */
export class BaseRepository {

  /*
  * create one
  * @returns {number | string} 新添加主键Id
  * */
  static async create<T extends GGModel>(modelInstance: T): Promise<number | string> {
    let primaryKey: PrimaryKey = BaseRepository.getModelInstancePrimaryKey(modelInstance);
    if (primaryKey) {
      const sql: InsertQuery = new InsertQuery().fromModel(modelInstance);
      SQLLogger.info(new MySqlQueryBuilder().buildInsertQuery(sql));
      const result: QueryResult = await DBClient.getClient().query(sql);
      if (result && result.rows[0]) {
        return result.rows[0]["insertId"];
      } else {
        throw new Error("INSERT_FAIL");
      }
    } else {
      throw new Error("INSERT_FAIL");
    }
  }

  /*
  * update one
  * @returns {number} 影响条数
  * */
  static async update<T extends GGModel>(modelInstance: T): Promise<number> {
    let primaryKey: PrimaryKey = BaseRepository.getModelInstancePrimaryKey(modelInstance);
    if (primaryKey) {
      const sql: UpdateQuery = new UpdateQuery().fromModel(modelInstance).where(`${primaryKey.sqlPrimaryKey} = ${modelInstance[primaryKey.modelPrimaryKey]}`);
      SQLLogger.info(new MySqlQueryBuilder().buildUpdateQuery(sql));
      let result: any = await  DBClient.getClient().query(sql);
      return Number(result["rows"]["affectedRows"]);
    } else {
      return 0;
    }
  }

  /*
  * destroy one
  * @returns {number} 影响条数
  * */
  static async destroy<T extends GGModel>(modelInstance: T): Promise<number> {
    let primaryKey: PrimaryKey = BaseRepository.getModelInstancePrimaryKey(modelInstance);
    if (primaryKey) {
      modelInstance.isDeleted = true;
      const sql: UpdateQuery = new UpdateQuery().fromModel(modelInstance).whereWithParam(`${primaryKey.sqlPrimaryKey} = :primaryKey`, {primaryKey: modelInstance[primaryKey.modelPrimaryKey]});
      SQLLogger.info(new MySqlQueryBuilder().buildUpdateQuery(sql));
      let result: any = await  DBClient.getClient().query(sql);
      return Number(result["rows"]["affectedRows"]);
    } else {
      return 0;
    }
  }

  /*
  * destroy some by primary keys
  * @returns
  * */
  public static async destroyByPrimaryKeys(tableName: string, primaryKeys: number[]): Promise<QueryResult> {
    let sql: DeleteQuery = new DeleteQuery().from(`${ tableName }`).where(`id in (${ primaryKeys.join(",") })`);
    SQLLogger.info(new MySqlQueryBuilder().buildDeleteQuery(sql));
    return await DBClient.getClient().query(sql);
  }

  /*
  * find one
  * @returns {Model} 单个Model
  * */
  static async findOne<T extends GGModel>(type: { new(): T; }, primaryKey: number | string): Promise<any> {
    let modelPrimaryKey: PrimaryKey = BaseRepository.getModelPrimaryKey(type);
    if (modelPrimaryKey) {
      const sql: SelectQuery = new SelectQuery().select().fromClass(type).where(`${modelPrimaryKey.sqlPrimaryKey} = ${primaryKey} and is_deleted = 0`);
      SQLLogger.info(new MySqlQueryBuilder().buildSelectQuery(sql));
      let result: QueryResult = await DBClient.getClient().query(sql);
      if (result && result.rows.length > 0) {
        let instance: T = GGModel.modelFromRow<T>(result.rows[0], type);
        return instance;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /*
  * find count
  * @returns {number} count
  * */
  static async count<T extends GGModel>(type: { new(): T; }): Promise<number> {
    let modelPrimaryKey: PrimaryKey = BaseRepository.getModelPrimaryKey(type);
    const sql: SelectQuery = new SelectQuery().select([`count(${modelPrimaryKey ? modelPrimaryKey.sqlPrimaryKey : "*"}) as count`]).fromClass(type).where(`is_deleted = 0`);
    SQLLogger.info(new MySqlQueryBuilder().buildSelectQuery(sql));
    let result: QueryResult = await DBClient.getClient().query(sql);
    if (result && result.rows.length > 0) {
      return Number(result.rows[0]["count"]);
    } else {
      return 0;
    }
  }

  /**
   * Returns "SELECT * FROM table" ORMed results.
   * @param type Class of T.
   * @returns {Array<T>} Model instances.
   */
  static async findAll<T extends GGModel>(type: { new(): T; }): Promise<T[]> {
    const sql: SelectQuery = new SelectQuery().select().fromClass(type).where(`is_deleted = 0`);
    SQLLogger.info(new MySqlQueryBuilder().buildSelectQuery(sql));
    let result: QueryResult = await DBClient.getClient().query(sql);

    let models: Array<T> = [];
    result.rows.forEach((row: any) => {
      let instance: T = GGModel.modelFromRow<T>(row, type);
      models.push(instance);
    });
    return models;
  }

  static async findAllWithLimitAndOffset<T extends GGModel>(type: { new(): T; }, limit: number, offset: number): Promise<T[]> {
    const sql: SelectQuery = new SelectQuery().select().fromClass(type).where(`is_deleted = 0`).setLimit(limit).setOffset(offset);
    SQLLogger.info(new MySqlQueryBuilder().buildSelectQuery(sql));
    let result: QueryResult = await DBClient.getClient().query(sql);

    let models: Array<T> = [];
    result.rows.forEach((row: any) => {
      let instance: T = GGModel.modelFromRow<T>(row, type);
      models.push(instance);
    });
    return models;
  }

  static async findAllWithSort<T extends GGModel>(type: { new(): T; }, sortField?: string, sortRule: string = "DESC"): Promise<T[]> {
    let selectQuery: SelectQuery = new SelectQuery().select().fromClass(type).where(`is_deleted = 0`);
    if (sortField) {
      selectQuery = selectQuery.orderBy(sortField, sortRule === "DESC" ? "DESC" : "ASC");
    }
    SQLLogger.info(new MySqlQueryBuilder().buildSelectQuery(selectQuery));
    let result: QueryResult = await DBClient.getClient().query(selectQuery);

    let models: Array<T> = [];
    result.rows.forEach((row: any) => {
      let instance: T = GGModel.modelFromRow<T>(row, type);
      models.push(instance);
    });

    return models;
  }

  static async findAllWithLimitAndOffsetAndSort<T extends GGModel>(type: { new(): T; }, limit: number, offset: number, sortField?: string, sortRule: string = "DESC"): Promise<T[]> {

    let selectQuery: SelectQuery = new SelectQuery().select().fromClass(type).where(`is_deleted = 0`).setLimit(limit).setOffset(offset);
    if (sortField) {
      selectQuery = selectQuery.orderBy(sortField, sortRule === "DESC" ? "DESC" : "ASC");
    }
    SQLLogger.info(new MySqlQueryBuilder().buildSelectQuery(selectQuery));
    let result: QueryResult = await DBClient.getClient().query(selectQuery);

    let models: Array<T> = [];
    result.rows.forEach((row: any) => {
      let instance: T = GGModel.modelFromRow<T>(row, type);
      models.push(instance);
    });

    return models;
  }


  public static getModelPrimaryKey<T extends GGModel>(model: { new(): T; }): PrimaryKey {
    let modelSqlFields: Array<SqlField> = sqlContext.findSqlFields(model);
    let sqlPrimaryKey: string;
    let modelPrimaryKey: string;
    for (let sqlField of modelSqlFields) {
      if (sqlField.flag === 0) {
        sqlPrimaryKey = <string>sqlField.columnName;
        modelPrimaryKey = <string>sqlField.name;
        break;
      }
    }
    if (sqlPrimaryKey && modelPrimaryKey) {
      return {sqlPrimaryKey: sqlPrimaryKey, modelPrimaryKey: modelPrimaryKey};
    } else {
      return null;
    }
  }

  public static getModelInstancePrimaryKey<T extends GGModel>(modelInstance: T): PrimaryKey {
    let model: Function = modelInstance.constructor;
    let modelSqlFields: Array<SqlField> = sqlContext.findSqlFields(model);
    let sqlPrimaryKey: string;
    let modelPrimaryKey: string;
    for (let sqlField of modelSqlFields) {
      if (sqlField.flag === 0) {
        sqlPrimaryKey = <string>sqlField.columnName;
        modelPrimaryKey = <string>sqlField.name;
        break;
      }
    }
    if (sqlPrimaryKey && modelPrimaryKey) {
      return {sqlPrimaryKey: sqlPrimaryKey, modelPrimaryKey: modelPrimaryKey};
    } else {
      return null;
    }
  }

}

