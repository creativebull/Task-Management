import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from '../../../../services/workspace.service';
import {Workspace} from '../../../../interfaces/workspace';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';

@UntilDestroy()
@Component({
  selector: 'app-workspace-home',
  templateUrl: './workspace-home.component.html',
  styleUrls: ['./workspace-home.component.scss']
})
export class WorkspaceHomeComponent implements OnInit {

  workspaces: Workspace[] = [];
  breadCrumbs: Breadcrumb[] = [
    {linkText: 'home', routeItems: ['/home']},
    {linkText: 'Workspaces', routeItems: ['/workspaces']},
  ];

  constructor(private workspaceService: WorkspaceService) {
  }

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces() {
    this.workspaceService.fetchWorkspaces().pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        this.workspaces = response.data;
      }
    });
  }

  selectWorkspace(workspace: Workspace) {
    console.log(workspace);
  }

  updateWorkspace(workspace: Workspace) {
    console.log(workspace);
  }

  deleteWorkspace(workspace: Workspace) {
    console.log(workspace);
  }

  addWorkspace() {
    console.log('add workspace');
  }
}
