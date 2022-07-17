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
    {linkText: 'Workspaces', routeItems: []},
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
    this.workspaceService.refreshWorkspaceList();

    this.workspaceService.workspaceListSubject().pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        this.workspaces = response;
      }
    });
  }

  selectWorkspace(workspace: Workspace) {
    this.workspaceService.setActiveWorkspace(workspace);
    this.toastr.success('Workspace selected successfully');
  }

  deleteWorkspace(workspace: Workspace) {
    // If we are deleting the active workspace, we need to set the active workspace to null
    if (this.activeWorkspace?.uuid === workspace.uuid) {
      this.workspaceService.setActiveWorkspace(undefined);
    }

    // Send request to delete the workspace from the server
    this.workspaceService.deleteWorkspace(workspace.uuid).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.toastr.success('Workspace deleted successfully');
        this.workspaceService.refreshWorkspaceList();

      },
      error: () => {
        this.toastr.error('Failed to delete the workspace');
      }
    });
  }
}
