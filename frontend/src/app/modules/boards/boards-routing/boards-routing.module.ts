import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {BoardsHomeComponent} from '../components/boards-home/boards-home.component';

const boardRoutes: Routes = [
  {path: '', component: BoardsHomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(boardRoutes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule {
}
