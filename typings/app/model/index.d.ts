// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOauth from '../../../app/model/oauth';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Oauth: ReturnType<typeof ExportOauth>;
    User: ReturnType<typeof ExportUser>;
  }
}
