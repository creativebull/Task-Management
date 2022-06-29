import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Workspace} from '../interfaces/workspace';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  fetchWorkspaces(): Observable<{ data: Workspace[] }> {
    return this.http.get<any>(this.apiUrl + 'workspaces');
  }

  createWorkspace(formData: FormData): Observable<Workspace> {
    return this.http.post<any>(this.apiUrl + 'workspaces', formData);
  }

  updateWorkspace(uuid: string, formData: any) {
    formData.method = 'PUT';
    return this.http.put<any>(this.apiUrl + 'workspaces/' + uuid, formData);
  }

  details(uuid: string): Observable<Workspace> {
    return this.http.get<any>(this.apiUrl + 'workspaces/' + uuid);
  }
}
