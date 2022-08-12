import {NgModule} from '@angular/core';
import {BoardsRoutingModule} from './boards-routing/boards-routing.module';
import { BoardsHomeComponent } from './components/boards-home/boards-home.component';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import { CreateBoardComponent } from './components/create-board/create-board.component';
import { UpdateBoardComponent } from './components/update-board/update-board.component';
import { BoardFormComponent } from './components/board-form/board-form.component';
import { BoardDetailsComponent } from './components/board-details/board-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SortablejsModule} from 'ngx-sortablejs';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [
    BoardsRoutingModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    SortablejsModule,
    FormsModule,
    SweetAlert2Module,
  ],
  declarations: [
    BoardsHomeComponent,
    CreateBoardComponent,
    UpdateBoardComponent,
    BoardFormComponent,
    BoardDetailsComponent
  ]
})
export class BoardsModule {
}
