/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import {ApiError, HttpResponse} from "sakura-node-3";

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
      { USERNAME_OR_PASSWORD_ERROR: "用户名或者密码错误" },
      { FILE_FORMAT_IS_WRONG: "文件的格式不对" },
      { FILE_NOT_FULL: "文件不能为空" },
      { PASSWORD_IS_TOO_SIMPLE: "密码太过简单" },
      { OLD_PASSWORD_IS_WRONG: "旧密码错误" },
      { ROLE_HAS_USER: "角色包含用户" },
      { ORGANIZATION_HAS_USER: "组织机构中包含用户" },
      { ORGANIZATION_HAS_ORGANIZATION: "组织机构中包含组织机构" },
      { POLT_IS_TOO_COMPLEX: "地块过于复杂" },
      { COORDINATES_OUT_OF_GUANGDONG: "坐标超出广东境内" },
      { TASK_NOT_END: "查勘任务未结束" },
      { POINT_NOT_END: "样点未采集完成" }
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

/*
* 正确返回 200
* */
export class SuccessResponse extends HttpResponse {
  data: any;

  constructor(data: any, code: number = 200) {
    super(code);
    this.data = data;
  }

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
  message: string = "BAD_REQUEST";

  constructor(message: string) {
    super(400);
    this.message = message;
  }

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
  private errors: Array<ApiError>;

  constructor(errors: Array<ApiError>) {
    super("PARAM_ERROR");
    this.errors = errors;
  }

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
  message: string = "AUTH_ERROR";

  constructor(message: string, code: number = 400) {
    super(code);
    this.message = message;
    this.code = code;
  }

  static missingAuthToken(): AuthErrorResponse {
    return new AuthErrorResponse("AUTH_MISSING_TOKEN", 401);
  }

  static authRequired(): AuthErrorResponse {
    return new AuthErrorResponse("AUTH_REQUIRED_ERROR", 401);
  }

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

  static serverHappenException(errMessage: string): ServerErrorResponse {
    return new ServerErrorResponse(new ApiError("EXCEPTION", errMessage), "SERVER_HAPPEN_EXCEPTION");
  }

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



