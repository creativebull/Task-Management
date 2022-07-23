import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from '../../../../services/workspace.service';
import {ActivatedRoute} from '@angular/router';
import {TasksService} from '../../../../services/tasks.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ToastrService} from 'ngx-toastr';
import {SortableOptions} from 'sortablejs';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';
import {BoardListService} from '../../../../services/board-list.service';
import {WorkspaceMembersService} from '../../../../services/workspace-members.service';
import {FormControl, FormGroup} from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.scss']
})
export class BoardDetailsComponent implements OnInit {
  activeListUuId?: string;
  workspaceMembers?: any; // TODO add an interface for this

  constructor(
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute,
    private taskService: TasksService,
    private toastrService: ToastrService,
    private boardListService: BoardListService,
    private workspaceMembersService: WorkspaceMembersService
  ) {
  }

  activeWorkspace: any;
  boardUuid!: string;

  maxItems = 30;

  taskLists = [
    {
      'name': 'Triage',
      tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems)),
      'uuid': this.generateRandomString(),
    },
    {
      'name': 'TODO',
      tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems)),
      'uuid': this.generateRandomString(),
    },
    {
      'name': 'Blocked',
      tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems)),
      'uuid': this.generateRandomString(),
    },
    {
      'name': 'TODO',
      tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems)),
      'uuid': this.generateRandomString(),
    },
    {
      'name': 'In Progress',
      tasks: this.createRandomTasks(Math.floor(Math.random() * this.maxItems)),
      'uuid': this.generateRandomString(),
    }
  ];

  generateRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
  loadingNewTaskForm = true;
  newTaskForm!: FormGroup;

  ngOnInit(): void {
    this.workspaceService.activeWorkspace?.subscribe(workspace => {
        this.activeWorkspace = workspace;
        this.route.params.subscribe(params => {
          this.boardUuid = params['uuid'];
          this.loadBoardListsAndTasks();
          this.loadWorkspaceMembers();
        })
      }
    );
  }

  loadBoardListsAndTasks() {
    this.boardListService.getBoardListsWithTasks(this.activeWorkspace.uuid, this.boardUuid).pipe(untilDestroyed(this)).subscribe({
      next: (boardLists) => {
        console.log(boardLists);
      }
    })
  }

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

  addTaskClick(uuid: string) {
    this.activeListUuId = uuid;
    this.initNewTaskForm();
  }

  initNewTaskForm() {
    this.loadingNewTaskForm = true;
    this.newTaskForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      assignedTo: new FormControl('')
    });

    this.loadingNewTaskForm = false;
  }

  loadWorkspaceMembers() {
    this.workspaceMembersService.getWorkspaceMembers(this.activeWorkspace.uuid).pipe(untilDestroyed(this)).subscribe({
      next: (members) => {
        this.workspaceMembers = members;
      }
    });
  }

  submitNewTask() {

  }
}
