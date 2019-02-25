/**
 * 业务中的一些interface
 * @author gaoqiang@gagogroup.com
 * @since 1.0.0
 * @version 2.0.0
 */

import {timestamp} from "sakura-node-3";

export interface BaseModel {
  id: number;
  isDeleted: boolean;
  createdAt: timestamp;
  updatedAt: timestamp;
}
