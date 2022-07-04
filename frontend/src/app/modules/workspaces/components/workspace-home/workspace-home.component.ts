import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from '../../../../services/workspace.service';
import {Workspace} from '../../../../interfaces/workspace';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';
import {ToastrService} from 'ngx-toastr';

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

  activeWorkspace?: Workspace;

  constructor(private workspaceService: WorkspaceService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.loadWorkspaces();
    this.loadActiveWorkspace();
  }

  loadActiveWorkspace() {
    this.workspaceService.activeWorkspace?.subscribe({
      next: (response) => {
        this.activeWorkspace = response;
      }
    })
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
    this.workspaceService.setActiveWorkspace(workspace);
    this.toastr.success('Workspace selected successfully');
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
