import { Component, OnInit } from '@angular/core';
import {Workspace} from '../../../../interfaces/workspace';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';

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

  constructor() { }

  ngOnInit(): void {
  }

  workspaceCreated(workspace: Workspace) {
    console.log(workspace);
  }
}
