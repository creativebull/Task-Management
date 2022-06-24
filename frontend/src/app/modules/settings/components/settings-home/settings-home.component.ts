import {Component, OnInit} from '@angular/core';
import {UserPermissionService} from '../../../../services/user-permission.service';
import {PageSetting} from '../../interface/page-setting';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.scss']
})
export class SettingsHomeComponent implements OnInit {

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'home', routeItems: ['/home']},
    {linkText: 'Settings', routeItems: []},
  ];

  settings: PageSetting[] = [
    {
      routeParts: ['/settings', 'user'],
      title: 'User',
      description: 'Update current user settings',
      faIcon: 'fa-user-edit',
      permissionRequired: ''
    },
  ];

  displayedSettings: PageSetting[] = [];

  constructor(private userPermissionService: UserPermissionService) {
  }

  ngOnInit(): void {
    this.processSettingsPage();
  }

  processSettingsPage() {
    for (const setting of this.settings) {
      if (!this.hasPermission(setting.permissionRequired)) {
        continue;
      }

      this.displayedSettings.push(setting);
    }
  }

  hasPermission(permission: string) {
    if (permission.length === 0) {
      return true;
    }
    return this.userPermissionService.hasPermissionTo(permission);
  }
}
