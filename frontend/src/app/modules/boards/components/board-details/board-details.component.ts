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
import {WorkspaceMember} from '../../../../interfaces/workspace-member';

@UntilDestroy()
@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.scss']
})
export class BoardDetailsComponent implements OnInit {
  activeListUuId!: string;
  workspaceMembers?: WorkspaceMember[];

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
    easing: "cubic-bezier(1, 0, 0, 1)",
    dataIdAttr: 'data-uuid',
    // Element dragging ended
    onEnd: (evt) => {
      const fromList = evt.from.dataset['uuid'];
      const toList = evt.to.dataset['uuid'];

      const toListIndex = evt.to.dataset['index'];
      const fromListIndex = evt.from.dataset['index'];

      if (fromList === toList) {
        this.postReorderList(fromList, toListIndex);
      } else {
        this.moveTask(fromList, toList, fromListIndex, toListIndex);
      }
    },
    handle: '.grab-handle'
  };

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['/']},
    {linkText: 'Boards', routeItems: ['/boards']},
    {linkText: 'Tasks', routeItems: []}
  ];
  loadingNewTaskForm = true;
  newTaskForm!: FormGroup;
  savingNewTask = false;

  newListForm!: FormGroup;
  loadingNewListForm = true;
  savingNewList = false;

  @ViewChild('closeNewTaskModalBtn') closeNewTaskModalBtn!: ElementRef
  @ViewChild('closeNewTaskListBtn') closeNewTaskListBtn!: ElementRef

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
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
        this.savingNewTask = false;
      }
    });
  }

  addNewListClick() {
    this.initNewListForm();
  }

  initNewListForm() {
    this.loadingNewListForm = true;
    this.newListForm = new FormGroup({
      name: new FormControl('')
    });
    this.loadingNewListForm = false;
  }

  newListSubmit() {
    this.savingNewList = true;

    this.boardListService.createBoardList(this.activeWorkspace.uuid, this.boardUuid, this.newListForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (list) => {
        this.toastrService.success('List created successfully');
        this.loadBoardListsAndTasks();
        this.savingNewList = false;
        this.newListForm.reset();
        this.closeNewTaskListBtn.nativeElement.click();
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
        this.savingNewList = false;
      }
    });
  }

  postReorderList(listUuId: string | undefined, listIndex: string | undefined) {
    if (listUuId && listIndex) {
      // Pull all the uuids from the list
      const taskUuIds = this.boardLists[parseInt(listIndex)].tasks.map(task => task.uuid);

      const postData = {
        uuids: taskUuIds
      };

      this.boardListService.reorderBoardList(this.activeWorkspace.uuid, this.boardUuid, postData, listUuId).pipe(untilDestroyed(this)).subscribe({
        next: (list) => {
          this.toastrService.success('List reordered successfully');
          this.loadBoardListsAndTasks();
        }
      });
    }
  }

  moveTask(fromListUuid: string | undefined, toListUuid: string | undefined, fromListIndex: string | undefined, toListIndex: string | undefined,) {
    if (!fromListUuid || !toListUuid || !toListIndex || !fromListIndex) {
      return;
    }

    const fromListTaskUuIds = this.boardLists[parseInt(fromListIndex)].tasks.map(task => task.uuid);
    const toListTaskUuIds = this.boardLists[parseInt(toListIndex)].tasks.map(task => task.uuid);

    const postData = {
      fromListUuIds: fromListTaskUuIds,
      toListUuIds: toListTaskUuIds,
      fromListUuId: fromListUuid,
      toListUuId: toListUuid,
    }

    this.boardListService.moveTask(this.activeWorkspace.uuid, this.boardUuid, postData).pipe(untilDestroyed(this)).subscribe({
      next: (task) => {
        this.toastrService.success('Task moved successfully');
        this.loadBoardListsAndTasks();
      }
    });
  }

  loadTaskDetails(taskUuId: string) {
    console.log(taskUuId);
  }
}

