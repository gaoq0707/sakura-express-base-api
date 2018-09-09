/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

import {Request, Response, NextFunction} from "../base/base";

export class RequestDad {

  static async requestDad(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.sendStatus(404);
  }
}