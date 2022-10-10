import { Component, OnInit } from '@angular/core';
import {Breadcrumb} from '../../../../models/breadcrumb';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  breadCrumbs: Breadcrumb[] = [
    {linkText: 'Home', routeItems: ['']},
  ]
  markdownInput: string = `# This is some markdown

\`\`\`php
<?php echo "test"; ?>
\`\`\`

\`\`\`js
var test = 1;
\`\`\`

:smile:
`;

  constructor() { }

  ngOnInit(): void {
  }

  showOutput() {
    console.log(this.markdownInput);
  }
}
