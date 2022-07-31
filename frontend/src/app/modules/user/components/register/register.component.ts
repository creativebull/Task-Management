import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
@UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  siteName = environment.appName;

  registerForm!: FormGroup;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      c_password: new FormControl('', [Validators.required]),
      acceptTerms: new FormControl('', [Validators.required]),
    });
  }

  handleRegisterForm() {
    this.authService.register(this.registerForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (res) => {
        this.authService.sendToken(res.data.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        let errorMessages = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);

        if (errorMessages.length > 0) {
          for (const errorMessage of errorMessages) {
            this.toastr.error(errorMessage);
          }
        } else {
          this.toastr.error('Failed to register, Unknown error');
        }
      }
    });
  }
}
