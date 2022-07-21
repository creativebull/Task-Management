import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardListService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getBoardListsWithTasks(workspace: string, board: string) {
    return this.http.get(this.apiUrl + 'boards/' + workspace + '/' + board + '/lists');
  }
}
