import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  template: ``
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.authService.logout();
    this.toastr.success('Logged out');
    this.router.navigate(['/']);
  }

}
