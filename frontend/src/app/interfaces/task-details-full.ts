import {User} from './user';

export interface TaskDetailsFull {
  uuid: string;
  name: string;
  description: string;
  user: User,
  assigned_to: User;
  position: number;
  created_at: string;
  updated_at: string;
}
