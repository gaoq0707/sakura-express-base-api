/**
 * Created by gaoqiang on 2018/9/9
 * Copyright (c) 2018 (gaoqiang@gagogroup.com). All rights reserved.
 */

export interface ApplicationOpts {
  port: number;
}

export interface SystemOpts {
  tokenTime: number;
  encrypKey: string;
}

export interface DBClientOpts {
  host: string;
  databaseName: string;
  username: string;
  password: string;
  port: number;
}

export interface MulterOpts {
  dest: string;
  fileSize: number;
}

export interface UploadPath {
  survey: MulterOpts;
}


