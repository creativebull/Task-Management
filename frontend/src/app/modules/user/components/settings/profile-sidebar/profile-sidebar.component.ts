import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../../services/auth.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {environment} from '../../../../../../environments/environment';
import {User} from '../../../../../interfaces/user';

@UntilDestroy()

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit {
  apiUrl = environment.apiUrl;
  userDetails!: User;
  avatarUrl = 'assets/img/blank.png'

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.loggedInUser().pipe(untilDestroyed(this)).subscribe((loggedInUser) => {
      this.userDetails = loggedInUser;
      if (loggedInUser.avatar) {
        this.avatarUrl = this.apiUrl + 'storage/' + loggedInUser.avatar;
      }
    })
  }
}
