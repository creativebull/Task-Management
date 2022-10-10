import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Board} from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  fetchBoards(workspace: string): Observable<{ data: Board[] }> {
    return this.http.get<any>(this.apiUrl + 'boards/' + workspace);
  }

  boardDetails(uuid: string, workspace: string): Observable<Board> {
    return this.http.get<any>(this.apiUrl + 'boards/' + workspace + '/' + uuid);
  }

  createBoard(formData: FormData, workspace: string): Observable<Board> {
    return this.http.post<any>(this.apiUrl + 'boards/' + workspace, formData);
  }

  updateBoard(uuid: string, formData: FormData, workspace: string): Observable<Board> {
    formData.set('_method', 'PUT');
    return this.http.post<any>(this.apiUrl + 'boards/' + workspace + '/' + uuid, formData);
  }

  deleteBoard(uuid: string, workspace: string): Observable<Board> {
    return this.http.delete<any>(this.apiUrl + 'boards/' + workspace + '/' + uuid);
  }
}
