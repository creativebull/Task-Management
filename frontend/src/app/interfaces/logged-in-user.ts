import {AccountSettings} from './account-settings';
import {Account} from './account';

export interface LoggedInUser {
  uuid: string;
  account_id: number;
  account_options: AccountSettings;
  avatar: string;
  created_at: string;
  email: string;
  is_verified: boolean;
  name: string;
  permissions: string[];
  account: Account;
}
