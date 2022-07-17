import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, ReplaySubject} from 'rxjs';
import {Workspace} from '../interfaces/workspace';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private apiUrl = environment.apiUrl;

  activeWorkspace?: ReplaySubject<Workspace> = new ReplaySubject<Workspace>(1);
  workspaceList?: ReplaySubject<Workspace[]> = new ReplaySubject<Workspace[]>(1);

  constructor(private http: HttpClient) {
  }

  workspaceListSubject(): ReplaySubject<Workspace[]> {
    if (!this.workspaceList) {
      this.workspaceList = new ReplaySubject<Workspace[]>();
      this.refreshWorkspaceList();
    }
    return this.workspaceList;
  }

  refreshWorkspaceList() {
    this.fetchWorkspaces().subscribe({
      next: (response) => {
        if (!this.workspaceList) {
          this.workspaceList = new ReplaySubject<Workspace[]>();
        }
        this.workspaceList.next(response.data);
      }
    });
  }

  activeWorkspaceSubject() {
    let activeWorkspaceFromLocal = localStorage.getItem('activeWorkspace');

    if (activeWorkspaceFromLocal) {
      if (!this.activeWorkspace) {
        this.activeWorkspace = new ReplaySubject<Workspace>();
      }
      this.activeWorkspace.next(JSON.parse(activeWorkspaceFromLocal));
    }

    return this.activeWorkspace;
  }

  setActiveWorkspace(workspace?: Workspace) {
    if (!this.activeWorkspace) {
      this.activeWorkspace = new ReplaySubject<Workspace>();
    }

    localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
    if (workspace) {
      this.activeWorkspace.next(workspace);
    }
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

  deleteWorkspace(uuid: string) {
    return this.http.delete<any>(this.apiUrl + 'workspaces/' + uuid);
  }
}
