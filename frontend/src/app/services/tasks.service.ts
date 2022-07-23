import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

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
}
