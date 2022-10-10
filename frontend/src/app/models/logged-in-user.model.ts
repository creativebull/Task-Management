export interface LoggedInUser {
  uuid: string;
  avatar: string;
  created_at: string;
  email: string;
  is_verified: boolean;
  name: string;
  permissions: string[];
}
