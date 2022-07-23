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

  getBoardListsWithTasks(workspace: string, board: string): Observable<BoardList[]> {
    return this.http.get<any>(this.apiUrl + 'boards/' + workspace + '/' + board + '/lists');
  }
}
