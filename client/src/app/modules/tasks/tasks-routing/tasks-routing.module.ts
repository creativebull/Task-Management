import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TasksHomeComponent} from '../components/tasks-home/tasks-home.component';
import {TasksAssignedToMeComponent} from '../components/tasks-assigned-to-me/tasks-assigned-to-me.component';
import {TasksCreatedByMeComponent} from '../components/tasks-created-by-me/tasks-created-by-me.component';

const tasksRoutes: Routes = [
  {path: '', component: TasksHomeComponent},
  {path: 'all', component: TasksHomeComponent},
  {path: 'my-assigned-tasks', component: TasksAssignedToMeComponent},
  {path: 'created-by-me', component: TasksCreatedByMeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(tasksRoutes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {
}
