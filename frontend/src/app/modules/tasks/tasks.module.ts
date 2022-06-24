import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksHomeComponent } from './components/tasks-home/tasks-home.component';
import {TasksRoutingModule} from './tasks-routing/tasks-routing.module';
import { TasksCreatedByMeComponent } from './components/tasks-created-by-me/tasks-created-by-me.component';
import { TasksAssignedToMeComponent } from './components/tasks-assigned-to-me/tasks-assigned-to-me.component';

@NgModule({
  declarations: [
    TasksHomeComponent,
    TasksCreatedByMeComponent,
    TasksAssignedToMeComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
  ]
})
export class TasksModule { }
