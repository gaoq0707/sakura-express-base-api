/**
 * base-express
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {ApiError, HttpResponse} from "sakura-node-3";

/**
 * @description 所有response code的集合
 * @author gaoqiang@gagogroup.com
 * @version 1.0.0
 * @deprecated
 */
export type responseCode = [
    {
        code: 400,
        message: "BAD_REQUEST",
        errors: [
            { PARAM_ERROR: "请求参数错误" },
            { VERIFICATION_CODE_ERROR: "验证码错误" },
            { DATA_NOT_FULL: "未找到对应的数据" },
            { COORDINATES_OUT_OF_CHINA: "坐标超出中国境内" },
            { PHONE_NUMBER_IS_EXISTED: "手机号已经存在" },
            { PHONE_NUMBER_NOT_FULL: "手机号不存在" },
            { USERNAME_OR_PASSWORD_ERROR: "用户名或者密码错误" },
            { FILE_FORMAT_IS_WRONG: "文件的格式不对" },
            { FILE_NOT_FULL: "文件不能为空" },
            { PASSWORD_IS_TOO_SIMPLE: "密码太过简单" },
            { OLD_PASSWORD_IS_WRONG: "旧密码错误" },
            { PASSWORD_NO_EQUALLY: "密码不一样" },
            { ROLE_HAS_USER: "角色包含用户" },
            { ORGANIZATION_HAS_USER: "组织机构中包含用户" },
            { ORGANIZATION_HAS_ORGANIZATION: "组织机构中包含组织机构" },
            { POLT_IS_TOO_COMPLEX: "地块过于复杂" },
            { COORDINATES_OUT_OF_GUANGDONG: "坐标超出广东境内" },
            { TASK_NOT_END: "查勘任务未结束" },
            { POINT_NOT_END: "样点未采集完成" },
            { ID_NUMBER_NUMBER_IS_EXISTED: "身份证信息已经存在" },
            { PASSWORD_IS_DEFAULT: "密码是默认密码" },
            { USERNAME_IS_DISABLE: "账号被禁用" },
            { ORGANIZATION_NAME_IS_EXISTED: "部门已存在，请重新输入部门名称" },
            { ROLE_NAME_IS_EXISTED: "角色已存在，请重新输入角色名称" }
            ]
    },
    {
        code: 401,
        message: "AUTH_ERROR",
        errors: [
            { AUTH_MISSING_TOKEN: "token信息验证失败" },
            { AUTH_REQUIRED_ERROR: "授权请求错误" }
            ]
    },
    {
        code: 500,
        message: "SERVER_ERROR",
        errors: [
            { SERVER_HAPPEN_EXCEPTION: "服务器发生异常" }
            ]
    }];

/**
 * @description response 200
 * @author gaoqiang@gagogroup.com
 * @version 2.0.0
 */
export class SuccessResponse extends HttpResponse {
    /**
     * @description 返回数据
     */
    data: any;

    /**
     * @description 构造函数
     * @param data 返回数据
     * @param code response code
     */
    constructor(data: any, code: number = 200) {
        super(code);
        this.data = data;
    }

    /**
     * json格式化
     */
    toJSON(): any {
        return {
            data: Object.assign(
                {code: this.code},
                {data: this.data}
            )
        };
    }
}

/*
* 请求处理失败 400
* */
export class BadRequestResponse extends HttpResponse {
    /**
     * @description 返回的错误消息
     */
    message: string = "BAD_REQUEST";

    /**
     * @description 构造函数
     * @param message 返回的错误消息
     */
    constructor(message: string) {
        super(400);
        this.message = message;
    }

    /**
     * json格式化
     */
    toJSON(): any {
        return {
            error: {
                code: this.code,
                message: this.message
            }
        };
    }
}

/*
* 请求参数错误 400
* */
export class ParamsErrorResponse extends BadRequestResponse {
    /**
     * @description 返回的详细错误列表
     */
    errors: Array<ApiError>;

    /**
     * @description 构造函数
     * @param errors 返回的详细错误列表
     */
    constructor(errors: Array<ApiError>) {
        super("PARAM_ERROR");
        this.errors = errors;
    }

    /**
     * json格式化
     */
    toJSON(): any {
        return {
            error: {
                code: this.code,
                message: this.message,
                errors: this.errors
            }
        };
    }
}

/*
* 授权错误 401
* */
export class AuthErrorResponse extends HttpResponse {
    /**
     * @description 返回的错误信息
     */
    message: string = "AUTH_ERROR";

    /**
     * 构造函数
     * @param message 要返回的错误信息
     * @param code response code
     */
    constructor(message: string, code: number = 400) {
        super(code);
        this.message = message;
        this.code = code;
    }

    /**
     * @description 生成授权丢失信息
     * @returns 授权丢失信息
     * @author gaoqiang@gagogroup.com
     */
    static missingAuthToken(): AuthErrorResponse {
        return new AuthErrorResponse("AUTH_MISSING_TOKEN", 401);
    }

    /**
     * @description 生成授权错误信息
     * @returns 授权错误信息
     * @author gaoqiang@gagogroup.com
     */
    static authRequired(): AuthErrorResponse {
        return new AuthErrorResponse("AUTH_REQUIRED_ERROR", 401);
    }

    /**
     * json格式化
     */
    toJSON(): any {
        return {
            error: {
                code: this.code,
                message: this.message
            }
        };
    }
}

/*
* 服务器错误 500
* */
export class ServerErrorResponse extends HttpResponse {
    errors: Array<ApiError>;
    message: string;

    constructor(error: ApiError, message: string = "SERVER_ERROR") {
        super(500);
        this.errors = [error];
        this.message = message;
    }

    /**
     * @description 生成服务器异常错误信息
     * @param errMessage 错误消息内容
     * @returns 服务器异常错误信息
     * @author gaoqiang@gagogroup.com
     */
    static serverHappenException(errMessage: string): ServerErrorResponse {
        return new ServerErrorResponse(new ApiError("EXCEPTION", errMessage), "SERVER_HAPPEN_EXCEPTION");
    }

    /**
     * json格式化
     */
    toJSON(): any {
        return {
            error: {
                code: this.code,
                message: this.message,
                errors: this.errors
            }
        };
    }
}



