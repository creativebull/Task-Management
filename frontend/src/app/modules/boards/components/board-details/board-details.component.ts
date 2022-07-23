import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {BoardList} from '../../../../interfaces/board-list';

@UntilDestroy()
@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.scss']
})
export class BoardDetailsComponent implements OnInit {
  activeListUuId!: string;
  workspaceMembers?: any; // TODO add an interface for this
  savingNewTask = false;

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

  boardLists: BoardList[] = [];

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

  @ViewChild('closeNewTaskModalBtn') closeNewTaskModalBtn!: ElementRef

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
        this.boardLists = boardLists;
      }
    })
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
      assigned_to: new FormControl('')
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
    this.savingNewTask = true;
    this.taskService.createTask(this.activeWorkspace.uuid, this.boardUuid, this.activeListUuId, this.newTaskForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (task) => {
        this.toastrService.success('Task created successfully');
        this.loadBoardListsAndTasks();
        this.closeNewTaskModalBtn.nativeElement.click();
        this.savingNewTask = false;
      }
    });
  }
}
