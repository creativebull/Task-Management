import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WorkspaceService} from '../../../../services/workspace.service';
import {ActivatedRoute, Router} from '@angular/router';
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
import {Board} from '../../../../interfaces/board';
import {BoardService} from '../../../../services/board.service';
import {TaskDetailsFull} from '../../../../interfaces/task-details-full';

@UntilDestroy()
@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.scss']
})
export class BoardDetailsComponent implements OnInit {
  activeListUuId!: string;
  workspaceMembers?: WorkspaceMember[];
  loadingBoardDetails = true;
  loadingBoardListsAndTasks = true;

  constructor(
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute,
    private taskService: TasksService,
    private toastrService: ToastrService,
    private boardListService: BoardListService,
    private workspaceMembersService: WorkspaceMembersService,
    private boardService: BoardService,
    private router: Router,
  ) {
  }

  activeWorkspace: any;
  boardUuid!: string;
  activeBoard!: Board;

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

  boardListsReorderOptions: SortableOptions = {
    group: 'board-lists',
    easing: "cubic-bezier(1, 0, 0, 1)",
    dataIdAttr: 'data-uuid',
    onEnd: () => {
      this.reorderBoardLists();
    }
  }

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['/']},
    {linkText: 'Boards', routeItems: ['/boards']},
    {linkText: 'Tasks', routeItems: []}
  ];

  newListForm!: FormGroup;
  loadingNewListForm = true;
  savingNewList = false;

  @ViewChild('closeTaskModal') closeTaskModal!: ElementRef
  @ViewChild('closeNewTaskListBtn') closeNewTaskListBtn!: ElementRef
  @ViewChild('closeBoardSettingsModalBtn') closeBoardSettingsModalBtn!: ElementRef

  loadingBoardSettingsForm = true;
  boardSettingsForm!: FormGroup;

  boardListEditIndex?: number;

  loadingTaskDetails = true;
  taskDetails!: TaskDetailsFull | null;

  newTask = false;

  ngOnInit(): void {
    this.workspaceService.activeWorkspace?.pipe(untilDestroyed(this)).subscribe(workspace => {
        this.activeWorkspace = workspace;
        this.route.params.pipe(untilDestroyed(this)).subscribe(params => {
          this.boardUuid = params['uuid'];
          this.loadBoardListsAndTasks();
          this.loadWorkspaceMembers();
          this.loadBoardDetails();
        })
      }
    );
  }

  loadBoardListsAndTasks() {
    this.loadingBoardListsAndTasks = true;
    this.boardListService.getBoardListsWithTasks(this.activeWorkspace.uuid, this.boardUuid).pipe(untilDestroyed(this)).subscribe({
      next: (boardLists) => {
        this.boardLists = boardLists;
        this.loadingBoardListsAndTasks = false;
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
        this.loadingBoardListsAndTasks = false;
      }
    })
  }

  addTaskClick(uuid: string) {
    this.loadingTaskDetails = true;

    // I'm not sure why but the taskDetails is not null when the modal is opened, Set timeout seems to fix it
    setTimeout(() => {
      this.newTask = true;
      this.taskDetails = null;
      this.activeListUuId = uuid;
      this.loadingTaskDetails = false;
    }, 10);
  }

  loadWorkspaceMembers() {
    this.workspaceMembersService.getWorkspaceMembers(this.activeWorkspace.uuid).pipe(untilDestroyed(this)).subscribe({
      next: (members) => {
        this.workspaceMembers = members;
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
      next: () => {
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
        next: () => {
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
      next: () => {
        this.toastrService.success('Task moved successfully');
        this.loadBoardListsAndTasks();
      }
    });
  }

  editTaskClick(taskUuId: string) {
    this.newTask = false;
    this.taskDetails = null;
    this.loadingTaskDetails = true;
    this.taskService.taskDetails(taskUuId).pipe(untilDestroyed(this)).subscribe({
      next: (task) => {
        this.taskDetails = task;
        this.loadingTaskDetails = false;
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
        this.loadingTaskDetails = false;
      }
    });
  }

  boardSettingsClick() {
    this.loadingBoardSettingsForm = true;
    this.boardSettingsForm = new FormGroup({
      name: new FormControl(this.activeBoard.name),
      description: new FormControl(this.activeBoard.description)
    });
    this.loadingBoardSettingsForm = false;
  }

  private loadBoardDetails() {
    this.loadingBoardDetails = true;
    this.boardService.boardDetails(this.boardUuid, this.activeWorkspace.uuid).pipe(untilDestroyed(this)).subscribe({
        next: (board) => {
          this.activeBoard = board;
          this.loadingBoardDetails = false;
        },
        error: (err) => {
          console.error(err.error.message);
          this.toastrService.error('Failed to load board details');
          this.loadingBoardDetails = false;
        }
      }
    );
  }

  handleBoardUpdated(board: any) {
    this.activeBoard = board;
    this.closeBoardSettingsModalBtn.nativeElement.click();
    this.toastrService.success('Board updated successfully');
  }

  updateBoardListNameClick(indexOfBoardList: number) {
    this.boardListEditIndex = indexOfBoardList;
  }

  updateBoardListName(indexOfBoardList: number) {
    this.boardListEditIndex = undefined;

    const board = this.boardLists[indexOfBoardList];

    const formData = new FormData();
    formData.append('name', board.name);

    this.boardListService.updateBoardList(this.activeWorkspace.uuid, this.activeBoard.uuid, board.uuid, formData).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.toastrService.success('List updated successfully');
      }
    });
  }

  deleteBoardList(boardList: BoardList) {
    this.boardListService.deleteBoardList(this.activeWorkspace.uuid, this.activeBoard.uuid, boardList.uuid).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.toastrService.success('List deleted successfully');
        this.loadBoardListsAndTasks();
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      }
    });
  }

  reorderBoardLists() {
    // Create a nice simple array of the uuids of the lists
    const listUuids = this.boardLists.map(list => list.uuid);

    const postData = {
      boardLists: listUuids
    }

    return this.boardListService.reorderBoardLists(this.activeWorkspace.uuid, this.activeBoard.uuid, postData).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.toastrService.success('Lists reordered successfully');
        this.loadBoardListsAndTasks();
      }
    });
  }

  deleteBoardClick() {
    this.boardService.deleteBoard(this.boardUuid, this.activeWorkspace.uuid).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.router.navigate(['/boards']);
      }
    });
  }

  taskCreated() {
    this.loadBoardListsAndTasks();
    this.closeTaskModal.nativeElement.click();
  }

  taskUpdated() {
    this.loadBoardListsAndTasks();
    this.closeTaskModal.nativeElement.click();
  }

  taskDeleted() {
    this.loadBoardListsAndTasks();
    this.closeTaskModal.nativeElement.click();
  }
}
