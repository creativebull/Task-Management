import {Task} from './task';

export interface BoardList {
  uuid: string;
  name: string;
  tasks: Task[]
  position: number;
}
