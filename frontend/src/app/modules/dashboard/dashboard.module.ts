import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import {DashboardRoutingModule} from './dashboard-routing/dashboard-routing.module';
import {SharedModule} from '../shared/shared.module';
import {MarkdownModule} from 'ngx-markdown';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
    FormsModule,
  ]
})
export class DashboardModule { }
