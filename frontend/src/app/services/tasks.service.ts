import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TaskDetailsFull} from '../interfaces/task-details-full';
import {Task} from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  createTask(workspace: string, boardUuid: string, activeListUuId: string, value: FormData): Observable<Task> {
    return this.http.post<any>(this.apiUrl + 'boards/' + workspace + '/' + boardUuid + '/' + activeListUuId + '/tasks', value);
  }

  taskDetails(taskUuId: string): Observable<TaskDetailsFull> {
    return this.http.get<any>(this.apiUrl + 'tasks/' + taskUuId);
  }

  updateTask(uuid: string, formData: FormData): Observable<Task> {
    return this.http.put<any>(this.apiUrl + 'tasks/' + uuid, formData);
  }

  deleteTask(uuid: string) {
    return this.http.delete(this.apiUrl + 'tasks/' + uuid);
  }
}
