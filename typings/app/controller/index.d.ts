// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGithub from '../../../app/controller/github';
import ExportHome from '../../../app/controller/home';
import ExportRights from '../../../app/controller/rights';
import ExportRoles from '../../../app/controller/roles';
import ExportUser from '../../../app/controller/user';
import ExportUsers from '../../../app/controller/users';
import ExportUtil from '../../../app/controller/util';

declare module 'egg' {
  interface IController {
    github: ExportGithub;
    home: ExportHome;
    rights: ExportRights;
    roles: ExportRoles;
    user: ExportUser;
    users: ExportUsers;
    util: ExportUtil;
  }
}
