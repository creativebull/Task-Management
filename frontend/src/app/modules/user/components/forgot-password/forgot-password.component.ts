import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {AuthService} from '../../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  appName = environment.appName;
  forgotPasswordForm!: FormGroup;
  buttonDisabled = false;

  constructor(private authService: AuthService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  forgotPasswordSubmit() {
    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(() => {
      this.toastr.success('Password reset link has been sent to ' + this.forgotPasswordForm.get('email')?.value);
      this.buttonDisabled = true;
    });
  }

}
