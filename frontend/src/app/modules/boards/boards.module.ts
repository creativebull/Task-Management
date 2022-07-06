import {NgModule} from '@angular/core';
import {BoardsRoutingModule} from './boards-routing/boards-routing.module';
import { BoardsHomeComponent } from './components/boards-home/boards-home.component';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    BoardsRoutingModule,
    SharedModule,
    CommonModule,
  ],
  declarations: [
    BoardsHomeComponent
  ]
})
export class BoardsModule {
}
