import { Component, OnInit } from '@angular/core';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';
import {Board} from '../../../../interfaces/board';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {
  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['/']},
    {linkText: 'Boards', routeItems: ['/boards']},
    {linkText: 'Create Board', routeItems: []},
  ];
  constructor(private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  handleBoardCreated($event: Board) {
    console.log($event);
    this.toastr.success('Board Created!');
    this.router.navigate(['/boards']).then();
  }
}
