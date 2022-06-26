import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserPermissionService} from '../../../../services/user-permission.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  activeTab = 'user-settings';

  availableTabs = ['user-settings'];

  constructor(
    private route: ActivatedRoute,
    private userPermissionService: UserPermissionService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (this.availableTabs.includes(params['tab'])) {
        this.activeTab = params['tab'];
      } else {
        this.activeTab = 'user-settings';
      }
    });
  }

  hasPermissionTo(permission: string) {
    return this.userPermissionService.hasPermissionTo(permission);
  }
}
