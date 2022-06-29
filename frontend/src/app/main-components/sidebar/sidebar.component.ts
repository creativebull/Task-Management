import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {WorkspaceService} from '../../services/workspace.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Workspace} from '../../interfaces/workspace';
@UntilDestroy()
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  appName = environment.appName;
  constructor(private workspaceService: WorkspaceService) { }

  workspaces: Workspace[] = [];

  ngOnInit(): void {
  }

  reloadWorkspaces() {
    this.workspaceService.fetchWorkspaces().pipe(untilDestroyed(this)).subscribe({
      next: (workspaces) => {
        this.workspaces = workspaces.data;
      }
    });
  }

  selectWorkspace(uuid: string) {
    console.log(uuid);
  }
}
