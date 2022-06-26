import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../../../interfaces/user';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {environment} from '../../../../../environments/environment';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';
import {FileService} from '../../../../services/file.service';
import {ImageService} from '../../../../services/image.service';

@UntilDestroy()
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  apiUrl = environment.apiUrl;

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'home', routeItems: ['/home']},
    {linkText: 'Settings', routeItems: ['/settings']},
    {linkText: 'User Settings', routeItems: []},
  ];

  userEditForm!: FormGroup;
  userDetails!: User;
  avatar ?: any
  avatarImageLink = 'assets/img/blank.png';

  changePasswordForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.authService.loggedInUser().pipe(untilDestroyed(this)).subscribe((loggedInUser) => {
      this.userDetails = loggedInUser;
      if (loggedInUser.avatar) {
        this.avatarImageLink = this.apiUrl + 'storage/' + loggedInUser.avatar;
      } else {
        this.avatarImageLink = 'assets/img/blank.png';
      }
    });

    this.initEditForm();
    this.initChangePasswordForm();
  }

  initChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      current_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      new_password_repeat: new FormControl('', [Validators.required]),
    });
  }

  initEditForm() {
    this.userEditForm = new FormGroup({
      name: new FormControl(this.userDetails.name, [Validators.required]),
      email: new FormControl(this.userDetails.email, [Validators.required, Validators.email])
    });
  }

  submitEdit() {
    const formData = new FormData();
    formData.append('name', this.userEditForm.get('name')?.value);
    formData.append('email', this.userEditForm.get('email')?.value);

    if (this.avatar) {
      const fileName = FileService.cleanFileName(this.avatar.name);
      formData.append('avatar', this.avatar, fileName);
    }

    this.authService.updateUser(formData).subscribe((res) => {
      if (res.success) {
        // this.authService.sendToken(res.data.token);
        this.authService.pushLoggedInUser(res.data.user);
        this.toastr.success('Updated');
      } else {
        // Handle errors from the api
        for (const errorMessage of res.errorMessages) {
          this.toastr.error(errorMessage);
        }
      }
    });
  }

  imageInputChange(image: any) {
    this.avatar = image.files[0];

    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.avatarImageLink = event.target.result;
    };

    reader.readAsDataURL(this.avatar);

    if (!ImageService.validImage(image.files[0])) {
      this.toastr.error('Invalid image');

      return;
    }
  }

  submitChangePassword() {
    this.authService.changePassword(this.changePasswordForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Password updated');
        } else {
          for (const errorMessage of res.errorMessages) {
            this.toastr.error(errorMessage);
          }
        }
      },
      error: (error) => {
        const errorMessages = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);
        for (const errorMessage of errorMessages) {
          this.toastr.error(errorMessage);
        }
      }
    });
  }

  refreshUserDetails() {
    this.authService.refreshUserData();
    this.toastr.success('User details updated');
  }
}
