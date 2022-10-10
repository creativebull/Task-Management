import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {WorkspaceMember} from '../models/workspace-member';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceMembersService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getWorkspaceMembers(uuid: string):Observable<WorkspaceMember[]> {
    return this.http.get<any>(this.apiUrl + 'workspaces/' + uuid + '/members');
  }
}
