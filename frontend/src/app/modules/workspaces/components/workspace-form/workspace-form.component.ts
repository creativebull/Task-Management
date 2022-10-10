import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Workspace} from '../../../../models/workspace';
import {WorkspaceService} from '../../../../services/workspace.service';
import {LaravelErrorExtractorService} from '../../../../services/laravel-error-extractor.service';
import {ToastrService} from 'ngx-toastr';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html',
  styleUrls: ['./workspace-form.component.scss']
})
export class WorkspaceFormComponent implements OnInit {

  workspaceForm!: FormGroup;

  @Input() workspace?: Workspace;

  @Output() workspaceCreated: EventEmitter<Workspace> = new EventEmitter<Workspace>();
  @Output() workspaceUpdated: EventEmitter<Workspace> = new EventEmitter<Workspace>();
  saving = false;

  constructor(private workspaceService: WorkspaceService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.workspaceForm = new FormGroup({
      name: new FormControl(this.workspace?.name, [Validators.required]),
      description: new FormControl(this.workspace?.description, [Validators.required])
    });
  }

  handleSubmit() {
    this.saving = true;
    if (this.workspace?.uuid) {
      this.updateWorkspace(this.workspace.uuid);
    } else {
      this.createWorkspace();
    }
  }

  updateWorkspace(uuid: string) {
    this.workspaceService.updateWorkspace(uuid, this.workspaceForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        this.workspaceUpdated.emit(response);
        this.saving = false;
      },
      error: (error) => {
        console.error(error);
        const errors = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);

        if (errors.length > 0) {
          for (const error of errors) {
            this.toastr.error(error);
          }
        } else {
          this.toastr.error('Something went wrong');
        }

        this.saving = false;
      }
    });
  }

  createWorkspace() {
    this.workspaceService.createWorkspace(this.workspaceForm.value).pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        this.workspaceCreated.emit(response);
        this.saving = false;
      },
      error: (error) => {
        console.error(error);
        const errors = LaravelErrorExtractorService.extractErrorMessagesFromErrorResponse(error);

        if (errors.length > 0) {
          for (const error of errors) {
            this.toastr.error(error);
          }
        }

        this.saving = false;
      }
    })
  }

}
