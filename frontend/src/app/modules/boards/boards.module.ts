import {NgModule} from '@angular/core';
import {BoardsRoutingModule} from './boards-routing/boards-routing.module';
import { BoardsHomeComponent } from './components/boards-home/boards-home.component';

@NgModule({
  imports: [
    BoardsRoutingModule,
  ],
  declarations: [
    BoardsHomeComponent
  ]
})
export class BoardsModule {
}
