import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceMembersService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getWorkspaceMembers(uuid: string) {
    return this.http.get(this.apiUrl + 'workspaces/' + uuid + '/members');
  }
}
