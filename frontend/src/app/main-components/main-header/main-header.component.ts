import {Component, Input, OnInit} from '@angular/core';
import {Breadcrumb} from '../../models/breadcrumb';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  @Input() header = '';
  @Input() breadCrumbs: Breadcrumb[] = [];
  @Input() pageTitle = '';
  @Input() subHeader = '';

  siteName = environment.appName;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    if (this.pageTitle.length > 0) {
      this.titleService.setTitle(this.siteName + ' - ' + this.pageTitle);
    } else {
      this.titleService.setTitle(this.siteName + ' - ' + this.header);
    }
  }
}
