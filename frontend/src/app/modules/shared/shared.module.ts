import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainHeaderComponent} from '../../main-components/main-header/main-header.component';
import {DataTablesModule} from 'angular-datatables';
import {RouterModule} from '@angular/router';
import {LoadingSpinnerComponent} from '../../main-components/loading-spinner/loading-spinner.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TruncatePipe} from '../../pipes/truncate.pipe';

const importsAndExports = [
  MainHeaderComponent,
  LoadingSpinnerComponent,
  TruncatePipe,
];

@NgModule({
  declarations: importsAndExports,
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule,
    ReactiveFormsModule,
  ],
  exports: importsAndExports,
  providers: []
})
export class SharedModule {
}
