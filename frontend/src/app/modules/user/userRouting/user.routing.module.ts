import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {ForgotPasswordComponent} from '../components/forgot-password/forgot-password.component';
import {LogoutComponent} from '../components/logout/logout.component';
import {ForgotPasswordConfirmComponent} from '../components/forgot-password-confirm/forgot-password-confirm.component';
import {RegisterComponent} from '../components/register/register.component';

const userRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'user/forgot-password', component: ForgotPasswordComponent},
  {path: 'user/forgot-password-confirm/:token', component: ForgotPasswordConfirmComponent},
  {path: 'user/register', component: RegisterComponent},
  {path: 'user/logout', component: LogoutComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
