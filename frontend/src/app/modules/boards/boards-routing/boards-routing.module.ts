import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {BoardsHomeComponent} from '../components/boards-home/boards-home.component';
import {BoardDetailsComponent} from '../components/board-details/board-details.component';
import {UpdateBoardComponent} from '../components/update-board/update-board.component';
import {CreateBoardComponent} from '../components/create-board/create-board.component';

const boardRoutes: Routes = [
  {path: '', component: BoardsHomeComponent},
  {path: 'create', component: CreateBoardComponent},
  {path: 'update/:uuid', component: UpdateBoardComponent},
  {path: ':uuid', component: BoardDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(boardRoutes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule {
}
