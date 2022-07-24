import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {BoardList} from '../interfaces/board-list';

@Injectable({
  providedIn: 'root'
})
export class BoardListService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  createBoardList(workspace: string, board: string, value: FormData): Observable<BoardList> {
    return this.http.post<any>(this.apiUrl + 'boards/' + workspace + '/' + board + '/boardLists', value);
  }

  getBoardListsWithTasks(workspace: string, board: string): Observable<BoardList[]> {
    return this.http.get<any>(this.apiUrl + 'boards/' + workspace + '/' + board + '/boardLists');
  }

  reorderBoardList(workspace: string, boardUuid: string, taskUuIds: string[], listUuId: string) {
    return this.http.post(this.apiUrl + 'boards/' + workspace + '/' + boardUuid + '/boardLists/' + listUuId + '/reorder', taskUuIds);
  }
}
