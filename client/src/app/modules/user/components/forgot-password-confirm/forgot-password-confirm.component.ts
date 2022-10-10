import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {environment} from '../../../../../environments/environment';
import {untilDestroyed} from '@ngneat/until-destroy';

@Component({
  selector: 'app-forgot-password-confirm',
  templateUrl: './forgot-password-confirm.component.html',
  styleUrls: ['./forgot-password-confirm.component.scss']
})
export class ForgotPasswordConfirmComponent implements OnInit {
  appName = environment.appName;
  confirmingCode = true;
  failedConfirm = false;
  errorMessages: string[] = [];

  serverResponse!: { created_at: string, email: string, id: number, token: string, updated_at: string };

  newPasswordForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        let token = params['token'];

        this.authService.checkForgotCode(token).pipe(untilDestroyed(this)).subscribe({
          next: (res) => {
            this.serverResponse = res;
            this.confirmingCode = false;
            this.initForm();
          },
          error: () => {
            this.toastr.error('Invalid link');
            this.confirmingCode = false;
            this.failedConfirm = true;
          }
        })
      }
    })
  }

  initForm() {
    this.newPasswordForm = new FormGroup({
      email: new FormControl(this.serverResponse.email, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.minLength(8)]),
      token: new FormControl(this.serverResponse.token, [Validators.required]),
    })
  }

  submitForgotPasswordConfirm() {
    this.errorMessages = [];

    this.authService.submitPasswordReset(this.newPasswordForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Password changed');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.errorMessages = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);
        for (const errorMessage of this.errorMessages) {
          this.toastr.error(errorMessage);
        }
      }
    });
  }
}
