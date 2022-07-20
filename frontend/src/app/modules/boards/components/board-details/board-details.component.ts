import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from '../../../../services/workspace.service';
import {ActivatedRoute} from '@angular/router';
import {TasksService} from '../../../../services/tasks.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {ToastrService} from 'ngx-toastr';
import {SortableOptions} from 'sortablejs';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';

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

  maxItems = 30;

  taskLists = [
    {
      'name': 'Triage', tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems))
    },
    {
      'name': 'TODO', tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems))
    },
    {
      'name': 'Blocked', tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems))
    },
    {
      'name': 'TODO', tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems))
    },
    {
      'name': 'In Progress', tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems))
    }
  ];

  createRandomTasks(count: number) {
    const tasks = [];
    for (let i = 0; i < count; i++) {
      tasks.push({
        'name': 'Task with a longer name, This is just to give the task a longer name, Is it working?' + (i + 1),
        'description': 'Task ' + (i + 1) + ' description',
        'status': 'todo',
        'assignedTo': 'John Doe'
      });
    }
    return tasks;
  }

  options: SortableOptions = {
    group: 'tasks',
    onEnd: (event: any) => {
      console.log(event);
      var itemEl = event.item;  // dragged HTMLElement
      console.log(itemEl);
      console.log(itemEl.to);
      console.log(itemEl.from);
    },
    // onSort: (event: any) => {
    //   console.log(event);
    // },
    handle: '.grab-handle'
  };

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['/']},
    {linkText: 'Boards', routeItems: ['/boards']},
    {linkText: 'Tasks', routeItems: []}
  ];

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
