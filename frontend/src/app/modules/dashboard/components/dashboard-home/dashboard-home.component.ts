import { Component, OnInit } from '@angular/core';
import {Breadcrumb} from '../../../../interfaces/breadcrumb';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['']},
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
