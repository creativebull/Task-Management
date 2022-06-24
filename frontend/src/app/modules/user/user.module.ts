import {NgModule} from '@angular/core';
import {UserRoutingModule} from './userRouting/user.routing.module';
import {LoginComponent} from './components/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {LogoutComponent} from './components/logout/logout.component';
import {ForgotPasswordConfirmComponent} from './components/forgot-password-confirm/forgot-password-confirm.component';
import {CommonModule} from '@angular/common';
import {ProfileSidebarComponent} from './components/settings/profile-sidebar/profile-sidebar.component';
import {SettingsComponent} from './components/settings/settings.component';
import {UserSettingsComponent} from '../settings/components/user-settings/user-settings.component';
import {DataTablesModule} from 'angular-datatables';
import { AccountSettingsComponent } from '../settings/components/account-settings/account-settings.component';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {SharedModule} from '../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  imports: [
    UserRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    SharedModule,
    SweetAlert2Module,
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    SettingsComponent,
    LogoutComponent,
    ForgotPasswordConfirmComponent,
    ProfileSidebarComponent,
    UserSettingsComponent,
    AccountSettingsComponent,
    RegisterComponent
  ]
})
export class UserModule {
}
