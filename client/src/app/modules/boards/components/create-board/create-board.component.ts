import { Component, OnInit } from '@angular/core';
import {Breadcrumb} from '../../../../models/breadcrumb.model';
import {Board} from '../../../../models/board.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {
  breadCrumbs: Breadcrumb[];
  
  constructor(private toastr: ToastrService, private router: Router) {
    this.breadCrumbs = [
      {linkText: 'Home', routeItems: ['/']},
      {linkText: 'Boards', routeItems: ['/boards']},
      {linkText: 'Create Board', routeItems: []},
    ];
  }

  ngOnInit(): void {
  }

  handleBoardCreated($event: Board) {
    this.toastr.success('Board Created!');
    this.router.navigate(['/boards']).then();
  }
}
