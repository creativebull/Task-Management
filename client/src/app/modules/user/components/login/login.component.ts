import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {environment} from '../../../../../environments/environment';

@UntilDestroy()

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  siteName = environment.appName;

  loginForm!: FormGroup;
  errorMessages: string[] = [];

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    this.toastr.clear();

    this.authService.login(this.loginForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (res) => {
        this.authService.sendToken(res.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        const errorMessages = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);
        if (errorMessages.length > 0) {
          for (const errorMessage of errorMessages) {
            this.toastr.error(errorMessage);
            this.loginForm.get('password')?.reset();
          }
        } else {
          this.toastr.error('Failed to login, Unknown error');
        }
      }
    });
  }
}
