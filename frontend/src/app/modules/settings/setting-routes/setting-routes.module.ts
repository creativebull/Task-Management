import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsHomeComponent} from '../components/settings-home/settings-home.component';
import {UserSettingsComponent} from '../components/user-settings/user-settings.component';

const settingRoutes: Routes = [
  {path: '', component: SettingsHomeComponent},
  {path: 'user', component: UserSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(settingRoutes)],
  exports: [RouterModule]
})
export class SettingRoutesModule {
}
