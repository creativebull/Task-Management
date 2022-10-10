import {Role} from './role';

export interface StaffMember {
  uuid: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  available_roles: Role[];
}
