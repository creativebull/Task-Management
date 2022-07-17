import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../../../services/board.service';
import {Workspace} from '../../../../interfaces/workspace';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {WorkspaceService} from '../../../../services/workspace.service';
import {Board} from '../../../../interfaces/board';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

@UntilDestroy()
@Component({
  selector: 'app-boards-home',
  templateUrl: './boards-home.component.html',
  styleUrls: ['./boards-home.component.scss']
})
export class BoardsHomeComponent implements OnInit {

  apiUrl = environment.apiUrl;

  activeWorkspace?: Workspace;
  boards: Board[] = [];
  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['/']},
    {linkText: 'Boards', routeItems: []}
  ];
  loading = true;

  constructor(
    private boardService: BoardService,
    private workspaceService: WorkspaceService,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.subscribeToActiveWorkspace();
  }

  subscribeToActiveWorkspace() {
    this.workspaceService.activeWorkspaceSubject()?.pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        this.activeWorkspace = response;
        this.loadBoards();
      }
    });
  }

  loadBoards() {
    if (this.activeWorkspace) {
      this.boardService.fetchBoards(this.activeWorkspace?.uuid).pipe(untilDestroyed(this)).subscribe({
        next: (response) => {
          this.boards = response.data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.toastrService.error('Failed to load boards');
        }
      });
    }
  }

}
