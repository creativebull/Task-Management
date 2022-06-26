import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {take} from 'rxjs/operators';
import {LoggedInUser} from '../interfaces/logged-in-user';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {
  }

  loggedIn!: ReplaySubject<boolean>;
  apiUrl = environment.apiUrl;

  user!: ReplaySubject<LoggedInUser>;

  private static blankUser() {
    const loggedInUser: LoggedInUser = {
      uuid: '',
      avatar: '',
      created_at: '',
      email: '',
      is_verified: false,
      name: '',
      permissions: [],
    };

    return loggedInUser;
  }

  sendToken(token: string) {
    localStorage.setItem('loggedInUser', token);
    this.pushLoginStatus(true);
  }

  getToken() {
    return localStorage.getItem('loggedInUser');
  }

  isLoggedIn() {
    const loggedIn = this.getToken() !== null;
    this.pushLoginStatus(loggedIn);

    if (loggedIn && !this.userDetailsStored()) {
      this.fetchUserDetails();
    }

    return loggedIn;
  }

  pushLoginStatus(status: boolean) {
    if (!this.loggedIn) {
      this.setupLoginStatus();
    }

    this.loggedIn.next(status);
  }

  private setupLoginStatus() {
    this.loggedIn = new ReplaySubject();
    this.isLoggedIn();
  }

  logout() {
    this.http.get(this.apiUrl + 'logout').pipe(take(1)).subscribe(() => {

    });
    // Remove the user from local storage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userData');

    // Push logged out to anywhere subscribed to the login status
    this.pushLoginStatus(false);
    this.setupBlankLoggedInUser();
  }

  login(loginFormData: FormData): Observable<{ token: string }> {
    return this.http.post<any>(this.apiUrl + 'login', loginFormData);
  }

  register(formData: FormData): Observable<{ data: {token: string, user: User}}> {
    return this.http.post<any>(this.apiUrl + 'register', formData);
  }

  updateUser(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'user/update', formData);
  }

  pushLoggedInUser(user: LoggedInUser) {
    if (!this.user) {
      this.setupBlankLoggedInUser();
    }

    localStorage.setItem('userData', JSON.stringify(user));

    this.user.next(user);
  }

  loggedInUser(): Observable<LoggedInUser> {
    if (!this.user) {
      this.setupBlankLoggedInUser();
    }

    if (this.isLoggedIn() && !this.userDetailsStored()) {
      this.fetchUserDetails();
      return this.user;
    } else if (this.isLoggedIn() && this.userDetailsStored()) {

      let userData = localStorage.getItem('userData');

      if (userData !== null) {
        this.user.next(JSON.parse(userData));
      }
    }

    return this.user;
  }

  private setupBlankLoggedInUser() {
    const blankUser: LoggedInUser = AuthService.blankUser();

    this.user = new ReplaySubject<LoggedInUser>();
    this.user.next(blankUser);
  }

  fetchUserDetails() {

    this.http.get<any>(this.apiUrl + 'user/details').subscribe({
      next: (res) => {
        this.pushLoggedInUser(res.data);
      }
    });
  }

  userDetailsStored() {
    return localStorage.getItem('userData');
  }

  refreshUserData() {
    this.fetchUserDetails();
  }

  resendVerifyEmail(email: string): Observable<{ success: boolean, errorMessages: string[]}> {
    return this.http.get<any>(this.apiUrl + 'email/resend/' + email);
  }

  changePassword(formData: FormData): Observable<{ success: boolean, errorMessages: string[]}> {
    return this.http.post<any>(this.apiUrl + 'user/change-password', formData);
  }

  forgotPassword(formData: FormData): Observable<{ success: boolean, errorMessages: string[]}> {
    return this.http.post<any>(this.apiUrl + 'user/forgot-password', formData);
  }

  checkForgotCode(token: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'user/forgot-password/find/' + token);
  }

  submitPasswordReset(formData: FormData): Observable<{ success: boolean, errorMessages: string[]}> {
    return this.http.post<any>(this.apiUrl + 'user/forgot-password/reset', formData);
  }
}
