import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkspaceRoutingModule} from './workspace-routing/workspace-routing.module';
import { WorkspaceHomeComponent } from './components/workspace-home/workspace-home.component';
import { CreateWorkspaceComponent } from './components/create-workspace/create-workspace.component';
import { UpdateWorkspaceComponent } from './components/update-workspace/update-workspace.component';
import { WorkspaceFormComponent } from './components/workspace-form/workspace-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    WorkspaceHomeComponent,
    CreateWorkspaceComponent,
    UpdateWorkspaceComponent,
    WorkspaceFormComponent
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class WorkspacesModule {
}
