import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionService {

  userPermissions: string[] = [];

  constructor() {
  }

  hasPermissionTo(permission: string) {

    permission = permission.toLowerCase();

    if (this.userPermissions.length === 0) {
      this.initPermissions();
    }

    return this.userPermissions.includes(permission);
  }

  initPermissions() {

    const userData = localStorage.getItem('userData');

    let loggedInUser: any;
    if (userData !== null) {
      loggedInUser = JSON.parse(userData);
    } else {
      loggedInUser = false;
    }

    if (loggedInUser) {
      this.userPermissions = loggedInUser.permissions;
    }
  }
}
