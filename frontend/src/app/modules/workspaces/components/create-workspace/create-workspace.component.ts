import {Component, OnInit} from '@angular/core';
import {Workspace} from '../../../../models/workspace';
import {Breadcrumb} from '../../../../models/breadcrumb';
import {WorkspaceService} from '../../../../services/workspace.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss']
})
export class CreateWorkspaceComponent implements OnInit {
  breadCrumbs: Breadcrumb[] = [
    {linkText: 'home', routeItems: ['/home']},
    {linkText: 'Workspaces', routeItems: ['/workspaces']},
    {linkText: 'Create Workspace', routeItems: []},
  ];

  constructor(private workspaceService: WorkspaceService, private toastr: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
  }

  workspaceCreated(workspace: Workspace) {
    this.workspaceService.setActiveWorkspace(workspace);
    this.toastr.success('Workspace created successfully');
    // TODO maybe redirect to boards here?
    this.router.navigate(['/workspaces']);
  }
}
