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

  loadTasksForBoard(workspaceUuId: string, boardUuid: string) {
    return this.http.get(this.apiUrl + 'boards/' + workspaceUuId + '/' + boardUuid + '/tasks');
  }
}
