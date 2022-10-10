import {WorkspaceUser} from './workspace-user.model';

export interface Workspace {
  uuid: string;
  workspaceUser: WorkspaceUser;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
