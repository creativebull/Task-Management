import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {WorkspaceService} from '../../services/workspace.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Workspace} from '../../models/workspace';
import {Router} from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  appName = environment.appName;
  activeWorkspace?: Workspace;

  constructor(
    private workspaceService: WorkspaceService,
    private router: Router) {
  }

  workspaces: Workspace[] = [];

  ngOnInit(): void {
    this.loadWorkspaces();
    this.subscribeToActiveWorkspace();
  }

  subscribeToActiveWorkspace() {
    this.workspaceService.activeWorkspaceSubject()?.pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        this.activeWorkspace = response;
      }
    });
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
    this.router.navigate(['/boards']).then(r => {
    });
  }
}
