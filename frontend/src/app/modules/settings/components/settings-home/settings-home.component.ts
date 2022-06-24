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
    {
      routeParts: ['/settings', 'account'],
      title: 'Account',
      description: 'Update account settings',
      faIcon: 'fa-building',
      permissionRequired: 'view account settings'
    },
    {
      routeParts: ['/settings', 'staff'],
      title: 'Staff',
      description: 'Add and update staff members',
      faIcon: 'fa-user',
      permissionRequired: 'view staff'
    },
    {
      routeParts: ['/settings', 'job-sms'],
      title: 'Job SMS',
      description: 'Add and update Job SMS Templates',
      faIcon: 'fa-envelope-open-text',
      permissionRequired: 'add sms'
    },
    {
      routeParts: ['/settings', 'opening-hours'],
      title: 'Opening Hours',
      description: 'Update the businesses opening hours',
      faIcon: 'fa-clock',
      permissionRequired: 'add opening hour'
    },
    {
      routeParts: ['/settings', 'account-finance-options'],
      title: 'Financial Options',
      description: 'Garage financial options',
      faIcon: 'fa-money-bill-wave',
      permissionRequired: 'view account settings'
    },
    {
      routeParts: ['/settings', 'account-social-options'],
      title: 'Social',
      description: 'Garage social media options',
      faIcon: 'fa-share-alt',
      permissionRequired: 'view account settings'
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
