import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidebarComponent} from './main-components/sidebar/sidebar.component';
import {NavbarComponent} from './main-components/navbar/navbar.component';
import {UserModule} from './modules/user/user.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './interceptors/token.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {XdebugInterceptor} from './interceptors/xdebug.interceptor';
import {AuthGuard} from './guards/auth.guard';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SortablejsModule} from 'ngx-sortablejs';
import {MarkdownModule, MarkedOptions} from 'ngx-markdown';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot({
      // Add custom options into swal globally
      provideSwal: () => import('sweetalert2').then(({default: swal}) => swal.mixin(
        {
          // Use bootstrap 4 buttons
          customClass: {
            confirmButton: 'btn btn-success btn-mr',
            cancelButton: 'btn btn-danger btn-mr'
          },
          buttonsStyling: false
        }
      ))
    }),
    SortablejsModule.forRoot({animation: 150}),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: false,
          pedantic: false,
          smartLists: true,
          smartypants: false,
        },
      },
    }),
    UserModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: XdebugInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
