import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {BoardList} from '../models/board-list.model';

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

  reorderBoardList(workspace: string, boardUuid: string, taskUuIds: { uuids: string[] }, listUuId: string) {
    return this.http.post(this.apiUrl + 'boards/' + workspace + '/' + boardUuid + '/boardLists/' + listUuId + '/reorder-tasks', taskUuIds);
  }

  moveTask(
    workspace: string,
    boardUuid: string,
    postData: { toListUuIds: string[]; fromListUuIds: string[], fromListUuId: string, toListUuId: string }) {
    return this.http.post(this.apiUrl + 'boards/' + workspace + '/' + boardUuid + '/boardLists/move-task', postData);
  }

  updateBoardList(workspace: string, boardUuId: string, boardListUuId: string, formData: FormData): Observable<BoardList> {
    formData.append('_method', 'put');
    return this.http.post<any>(this.apiUrl + 'boards/' + workspace + '/' + boardUuId + '/boardLists/' + boardListUuId, formData);
  }

  deleteBoardList(workspace: string, boardUuId: string, boardListUuId: string): Observable<any> {
    return this.http.delete(this.apiUrl + 'boards/' + workspace + '/' + boardUuId + '/boardLists/' + boardListUuId);
  }

  reorderBoardLists(workspace: string, boardUuId: string, boardListUuIds: {boardLists: string[]}): Observable<any> {
    return this.http.post(this.apiUrl + 'boards/' + workspace + '/' + boardUuId + '/boardLists/reorder', boardListUuIds);
  }
}
