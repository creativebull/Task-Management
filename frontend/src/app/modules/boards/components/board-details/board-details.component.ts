import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from '../../../../services/workspace.service';
import {ActivatedRoute} from '@angular/router';
import {TasksService} from '../../../../services/tasks.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {ToastrService} from 'ngx-toastr';
import {SortableOptions} from 'sortablejs';

@UntilDestroy()
@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.scss']
})
export class BoardDetailsComponent implements OnInit {

  constructor(
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute,
    private taskService: TasksService,
    private toastrService: ToastrService) {
  }

  activeWorkspace: any;
  boardUuid!: string;

  items1 = [1, 2, 3, 4, 5]; // TODO testing only
  items2 = ['a', 'b', 'c', 'd', 'e']; // TODO testing only

  options: SortableOptions = {
    group: 'test'
  };

  ngOnInit(): void {
    this.workspaceService.activeWorkspace?.subscribe(workspace => {
        this.activeWorkspace = workspace;
        this.route.params.subscribe(params => {
          this.boardUuid = params['uuid'];
          this.loadBoardTasks();
        })
      }
    );
  }

  loadBoardTasks() {
    this.taskService.loadTasksForBoard(this.activeWorkspace.uuid, this.boardUuid).pipe(untilDestroyed(this)).subscribe({
      next: tasks => {
        console.log(tasks);
      },
      error: err => {
        const errorMessages = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(err);
        console.error(errorMessages);
        if (errorMessages.length > 0) {
          for (let errorMessage of errorMessages) {
            this.toastrService.error(errorMessage);
          }
        } else {
          this.toastrService.error('Something went wrong');
        }
      }
    });
  }

}
