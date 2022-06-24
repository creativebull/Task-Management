import {Component, NgZone, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  showNavs = true;

  // Add to this array to hide the nav for certain pages
  routesToHideNav: string[] = [
    '/login', '/register', '/user/forgot-password', 'jobs/customer-job-invoice','jobs/customer-job-report'
  ];

  constructor(private zone: NgZone, private router: Router) {
  }

  ngOnInit() {
    // Stop the navigation showing on certain pages
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {

        this.showNavs = true;
        for (const hiddenPart of this.routesToHideNav) {
          if (event.url.search(hiddenPart) !== -1) {
            this.showNavs = false;
          }
        }
      }
    });
  }

}
