/**
 * base-repository
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {GGModel, SelectQuery, InsertQuery, UpdateQuery, sqlContext, SqlField, DeleteQuery} from "sakura-node-3";
import {DBClient, MySqlQueryBuilder, QueryResult} from "sakura-node-3";
import {SQLLogger} from "../logger/elk-logger";

/**
 * @description 主键类
 * @author gaoqiang@gagogroup.com
 * @version 2.0.0
 */
interface PrimaryKey {
    /**
     * @description 主键key
     */
    sqlPrimaryKey: string;
    /**
     * @description model 主键值
     */
    modelPrimaryKey: string;
}

/**
 * @description repository的基类
 * @author gaoqiang@gagogroup.com
 * @version 2.0.0
 */
export class BaseRepository {

    /**
     * @description 创建单个model
     * @param modelInstance 要添加的model实例
     * @returns 新添加数据的主键Id
     * @author gaoqiang@gagogroup.com
     */
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

    /**
     * @description 修改单个model
     * @param modelInstance 要修改的model实例
     * @returns 影响条数
     * @author gaoqiang@gagogroup.com
     */
    static async update<T extends GGModel>(modelInstance: T): Promise<number> {
        let primaryKey: PrimaryKey = BaseRepository.getModelInstancePrimaryKey(modelInstance);
        if (primaryKey) {
            const sql: UpdateQuery = new UpdateQuery().fromModel(modelInstance).where(`${primaryKey.sqlPrimaryKey} = ${modelInstance[primaryKey.modelPrimaryKey]}`);
            SQLLogger.info(new MySqlQueryBuilder().buildUpdateQuery(sql));
            let result: any = await DBClient.getClient().query(sql);
            return Number(result["rows"]["affectedRows"]);
        } else {
            return 0;
        }
    }

    /**
     * @description 删除单个model
     * @param modelInstance 要删除的model实例
     * @returns 影响条数
     * @author gaoqiang@gagogroup.com
     */
    static async destroy<T extends GGModel>(modelInstance: T): Promise<number> {
        let primaryKey: PrimaryKey = BaseRepository.getModelInstancePrimaryKey(modelInstance);
        if (primaryKey) {
            modelInstance.isDeleted = true;
            const sql: UpdateQuery = new UpdateQuery().fromModel(modelInstance).whereWithParam(`${primaryKey.sqlPrimaryKey} = :primaryKey`, {primaryKey: modelInstance[primaryKey.modelPrimaryKey]});
            SQLLogger.info(new MySqlQueryBuilder().buildUpdateQuery(sql));
            let result: any = await DBClient.getClient().query(sql);
            return Number(result["rows"]["affectedRows"]);
        } else {
            return 0;
        }
    }

    /**
     * @description 根据多个主键和表名同时删除多条数据
     * @param tableName 要删除的数据表名
     * @param primaryKeys 要删除的主键id列表
     * @returns 执行结果
     * @author gaoqiang@gagogroup.com
     */
    public static async destroyByPrimaryKeys(tableName: string, primaryKeys: number[]): Promise<QueryResult> {
        let sql: DeleteQuery = new DeleteQuery().from(`${tableName}`).where(`id in (${primaryKeys.join(",")})`);
        SQLLogger.info(new MySqlQueryBuilder().buildDeleteQuery(sql));
        return await DBClient.getClient().query(sql);
    }

    /**
     * @description 根据主键Id和model类型查询单个model
     * @param type 要返回的model类型
     * @param primaryKey 主键值
     * @returns 单个model
     * @author gaoqiang@gagogroup.com
     */
    static async findOne<T extends GGModel>(type: { new(): T; }, primaryKey: number | string): Promise<T> {
        let modelPrimaryKey: PrimaryKey = BaseRepository.getModelPrimaryKey(type);
        if (modelPrimaryKey) {
            const sql: SelectQuery = new SelectQuery().select().fromClass(type).where(`${modelPrimaryKey.sqlPrimaryKey} = ${primaryKey} and is_deleted = 0`);
            SQLLogger.info(new MySqlQueryBuilder().buildSelectQuery(sql));
            let result: QueryResult = await DBClient.getClient().query(sql);
            if (result && result.rows.length > 0) {
                return GGModel.modelFromRow<T>(result.rows[0], type);
            }
        }
        return null;
    }

    /**
     * @description 根据model类型查询数据条数
     * @param type 要返回的model类型
     * @returns 数据条数
     * @author gaoqiang@gagogroup.com
     */
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
     * @description 根据model类型查询所有数据
     * @param type 要返回的model类型
     * @returns 数据列表
     * @author gaoqiang@gagogroup.com
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

    /**
     * @description 根据model类型分页查询所有数据
     * @param type 要返回的model类型
     * @param limit 返回数据总数
     * @param offset 需要偏移的数据量
     * @returns 数据列表
     * @author gaoqiang@gagogroup.com
     */
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

    /**
     * @description 根据model类型排序查询所有数据
     * @param type 要返回的model类型
     * @param sortField 排序字段
     * @param sortRule 排序规则 "ASC"或"DESC",默认"DESC"
     * @returns 数据列表
     * @author gaoqiang@gagogroup.com
     */
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

    /**
     * @description 根据model类型分页排序查询所有数据
     * @param type 要返回的model类型
     * @param limit 返回数据总数
     * @param offset 需要偏移的数据量
     * @param sortField 排序字段
     * @param sortRule 排序规则 "ASC"或"DESC",默认"DESC"
     * @returns 数据列表
     * @author gaoqiang@gagogroup.com
     */
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

    /**
     * @description 根据model类型获取主键字段名和数据
     * @param type 要返回的model类型
     * @returns 数据列表
     * @author gaoqiang@gagogroup.com
     */
    public static getModelPrimaryKey<T extends GGModel>(type: { new(): T; }): PrimaryKey {
        let modelSqlFields: Array<SqlField> = sqlContext.findSqlFields(type);
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

    /**
     * @description 根据model实例获取主键
     * @param modelInstance model实例
     * @returns 数据列表
     * @author gaoqiang@gagogroup.com
     */
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

