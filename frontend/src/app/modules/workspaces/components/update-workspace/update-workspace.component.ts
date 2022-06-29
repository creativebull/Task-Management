import {Component, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';
import {Workspace} from '../../../../interfaces/workspace';
import {ActivatedRoute} from '@angular/router';
import {WorkspaceService} from '../../../../services/workspace.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ToastrService} from 'ngx-toastr';
@UntilDestroy()
@Component({
  selector: 'app-update-workspace',
  templateUrl: './update-workspace.component.html',
  styleUrls: ['./update-workspace.component.scss']
})
export class UpdateWorkspaceComponent implements OnInit {
  loading = true;
  workspace!: Workspace;

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'home', routeItems: ['/home']},
    {linkText: 'Workspaces', routeItems: ['/workspaces']},
    {linkText: 'Update Workspace', routeItems: []},
  ];

  constructor(private route: ActivatedRoute, private workspaceService: WorkspaceService, private toastr: ToastrService) {


  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadWorkspace(params['uuid']);
    })
  }

  loadWorkspace(uuid: string) {
    this.workspaceService.details(uuid).pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        this.workspace = response;
        this.loading = false;
      }
    });
  }

  workspaceUpdated($event: Workspace) {
    console.log($event);
    this.toastr.success('Workspace updated successfully');
  }
}
