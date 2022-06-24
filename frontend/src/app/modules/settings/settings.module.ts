import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingRoutesModule} from './setting-routes/setting-routes.module';
import {SettingsHomeComponent} from './components/settings-home/settings-home.component';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    SettingsHomeComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutesModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class SettingsModule {
}
