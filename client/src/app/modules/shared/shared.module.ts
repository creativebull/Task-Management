import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainHeaderComponent} from '../../main-components/main-header/main-header.component';
import {DataTablesModule} from 'angular-datatables';
import {RouterModule} from '@angular/router';
import {LoadingSpinnerComponent} from '../../main-components/loading-spinner/loading-spinner.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TruncatePipe} from '../../pipes/truncate.pipe';
import {TaskFormComponent} from '../../shared-components/task-form/task-form.component';
import {MarkdownModule} from 'ngx-markdown';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';

const importsAndExports = [
  MainHeaderComponent,
  LoadingSpinnerComponent,
  TaskFormComponent,
  TruncatePipe,
];

@NgModule({
  declarations: importsAndExports,
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule,
    ReactiveFormsModule,
    MarkdownModule,
    SweetAlert2Module,
  ],
  exports: importsAndExports,
  providers: []
})
export class SharedModule {
}
