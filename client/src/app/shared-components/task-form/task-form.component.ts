import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskDetailsFull} from '../../models/task-details-full.model';
import {FormControl, FormGroup} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {TasksService} from '../../services/tasks.service';
import {WorkspaceMembersService} from '../../services/workspace-members.service';
import {WorkspaceMember} from '../../models/workspace-member.model';
import {WorkspaceService} from '../../services/workspace.service';
import {Task} from '../../models/task.model';
import {Board} from '../../models/board.model';

@UntilDestroy()
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Input() taskDetails: TaskDetailsFull | null = {} as TaskDetailsFull;
  @Input() board: Board | null = null;
  @Input() boardListUuId: string | null = null;

  @Output() taskUpdated: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskCreated: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  savingTaskDetails = false;
  taskDetailsForm!: FormGroup;
  loadingTaskDetailsForm = true;
  taskMarkdownText!: string;

  taskDescriptionEditBox: boolean = false;

  workspaceMembers?: WorkspaceMember[];

  activeWorkspace: any;

  errors: string[] = [];

  constructor(
    private taskService: TasksService,
    private workspaceMembersService: WorkspaceMembersService,
    private workspaceService: WorkspaceService
  ) {
  }

  ngOnInit(): void {
    this.workspaceService.activeWorkspace?.pipe(untilDestroyed(this)).subscribe(workspace => {
      this.activeWorkspace = workspace;
      this.initForm();
      this.taskMarkdownText = this.taskDetailsForm.get('description')?.value;
    });
  }

  initForm() {
    this.loadingTaskDetailsForm = true;
    this.loadWorkspaceMembers();

    if (this.taskDetails === null) {
      this.taskDetails = {} as TaskDetailsFull;
      // If we are creating a new task, Show the edit box
      this.taskDescriptionEditBox = true;
    }

    this.taskDetailsForm = new FormGroup({
      name: new FormControl(this.taskDetails.name),
      description: new FormControl(this.taskDetails.description),
      assigned_to: new FormControl(this.taskDetails.assigned_to?.uuid)
    });

    this.loadingTaskDetailsForm = false;
  }

  submitTaskDetails() {
    this.savingTaskDetails = true;

    if (this.taskDetails?.uuid === null || typeof this.taskDetails?.uuid === 'undefined') {
      this.createTask();
      this.savingTaskDetails = false;
      return;
    }

    this.updateTask();
    this.savingTaskDetails = false;
  }

  updateTask() {
    if (this.taskDetails === null) {
      return;
    }

    this.taskService.updateTask(this.taskDetails?.uuid, this.taskDetailsForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (task: Task) => {
        this.taskUpdated.emit(task);
      },
      error: (err: any) => {
        this.errors.push(err.error.message);
      }
    });
  }

  createTask() {
    if (this.board === null || this.boardListUuId === null) {
      this.errors.push('Failed to create task, Please try again');
      return;
    }

    this.taskService.createTask(this.activeWorkspace.uuid, this.board.uuid, this.boardListUuId, this.taskDetailsForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (task) => {
        this.taskCreated.emit(task);
      },
      error: (err) => {
        this.errors.push(err.error.message);
      }
    });
  }

  upDateTaskMarkdownPreviewText() {
    if (!this.taskDetailsForm) {
      return;
    }
    this.taskMarkdownText = this.taskDetailsForm.get('description')?.value;
  }

  toggleTaskDescriptionEditBox() {
    this.taskDescriptionEditBox = !this.taskDescriptionEditBox;
  }

  loadWorkspaceMembers() {
    this.workspaceMembersService.getWorkspaceMembers(this.activeWorkspace.uuid).pipe(untilDestroyed(this)).subscribe({
      next: (members) => {
        this.workspaceMembers = members;
      }
    });
  }

  deleteTask(uuid: string | undefined) {
    if (typeof uuid === 'undefined') {
      this.errors.push('Failed to delete task, Please try again');
      return;
    }
    this.taskService.deleteTask(uuid).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.taskDeleted.emit(true);
      },
      error: (err) => {
        this.errors.push(err.error.message);
      }
    })
  }
}
