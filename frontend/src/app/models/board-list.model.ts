import {Task} from './task.model';

export interface BoardList {
  uuid: string;
  name: string;
  tasks: Task[]
  position: number;
}
