import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TaskDetailsFull} from '../interfaces/task-details-full';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  createTask(workspace: string, boardUuid: string, activeListUuId: string, value: FormData) {
    return this.http.post(this.apiUrl + 'boards/' + workspace + '/' + boardUuid + '/' + activeListUuId + '/tasks', value);
  }

  taskDetails(taskUuId: string): Observable<TaskDetailsFull> {
    return this.http.get<any>(this.apiUrl + 'tasks/' + taskUuId);
  }

  updateTask(uuid: string, formData: FormData) {
    return this.http.put(this.apiUrl + 'tasks/' + uuid, formData);
  }

  deleteTask(uuid: string) {
    return this.http.delete(this.apiUrl + 'tasks/' + uuid);
  }
}
