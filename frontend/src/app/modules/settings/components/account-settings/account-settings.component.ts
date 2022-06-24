import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {LoggedInUser} from '../../../../interfaces/logged-in-user';
import {CurrencyService} from '../../../../services/currency.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ImageService} from '../../../../services/image.service';
import {ToastrService} from 'ngx-toastr';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {environment} from '../../../../../environments/environment';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';
import {FileService} from '../../../../services/file.service';

@UntilDestroy()
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  breadCrumbs: Breadcrumb[] = [
    {linkText: 'home', routeItems: ['/home']},
    {linkText: 'Settings', routeItems: ['/settings']},
    {linkText: 'Account Settings', routeItems: []},
  ];
  loggedInUser?: LoggedInUser;
  loadingForm = true;
  accountSettingsForm!: FormGroup;

  avatar: any;
  avatarImageLink = 'assets/img/blank.png';

  apiUrl = environment.apiUrl;

  currencies: { code: string, currency: string }[] = [];

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.authService.loggedInUser().subscribe((res) => {
      this.loggedInUser = res;

      if (this.loggedInUser.account.avatar) {
        this.avatarImageLink = this.apiUrl + 'storage/' + this.loggedInUser.account.avatar;
      } else {
        this.avatarImageLink = 'assets/img/blank.png';
      }

      this.initAccountSettingsForm();
    });
  }

  initAccountSettingsForm() {
    this.loadingForm = true;

    this.accountSettingsForm = new FormGroup({
      name: new FormControl(this.loggedInUser?.account.name, [Validators.required]),
      account_address: new FormControl(this.loggedInUser?.account.account_address),
      account_email: new FormControl(this.loggedInUser?.account.account_email, [Validators.required, Validators.email]),
      account_postcode: new FormControl(this.loggedInUser?.account.account_postcode),
      website_address: new FormControl(this.loggedInUser?.account.website_address),
      account_phone_number: new FormControl(this.loggedInUser?.account.account_phone_number),
    });

    this.loadingForm = false;
  }

  saveAccountSettings() {
    const formData: FormData = new FormData();
    formData.append('name', this.accountSettingsForm.get('name')?.value);
    formData.append('account_email', this.accountSettingsForm.get('account_email')?.value);
    formData.append('account_address', this.accountSettingsForm.get('account_address')?.value);
    formData.append('account_postcode', this.accountSettingsForm.get('account_postcode')?.value);
    formData.append('account_phone_number', this.accountSettingsForm.get('account_phone_number')?.value);
    formData.append('vat_number', this.accountSettingsForm.get('vat_number')?.value);
    formData.append('website_address', this.accountSettingsForm.get('website_address')?.value);

    if (this.avatar) {
      const fileName = FileService.cleanFileName(this.avatar.name);
      formData.append('avatar', this.avatar, fileName);
    }

    this.authService.updateAccountBasicDetails(formData).pipe(untilDestroyed(this)).subscribe({
      next: (res) => {
        if (res.success) {
          this.authService.pushLoggedInUser(res.userDetails);
          this.toastr.success('Updated');
        }
      },
      error: (error) => {
        const errorMessages = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);
        if (errorMessages.length > 0) {
          for (const errorMessage of errorMessages) {
            this.toastr.error(errorMessage);
          }
        } else {
          this.toastr.error('Something went wrong, Please try again');
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
}
