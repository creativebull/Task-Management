import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../../../services/board.service';
import {Workspace} from '../../../../interfaces/workspace';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {WorkspaceService} from '../../../../services/workspace.service';
import {Board} from '../../../../interfaces/board';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';

@UntilDestroy()
@Component({
  selector: 'app-boards-home',
  templateUrl: './boards-home.component.html',
  styleUrls: ['./boards-home.component.scss']
})
export class BoardsHomeComponent implements OnInit {

  activeWorkspace?: Workspace;
  boards: Board[] = [];
  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['/']},
    {linkText: 'Boards', routeItems: []}
  ];

  constructor(private boardService: BoardService, private workspaceService: WorkspaceService) {
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
        }
      });
    }
  }

}
