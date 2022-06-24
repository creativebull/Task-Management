import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {StaffMember} from '../interfaces/staff-member';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  allStaff(): Observable<{ data: StaffMember[] }> {
    return this.http.get<any>(this.apiUrl + 'staff/all');
  }

  fetchStaffDetails(staffUuId: string): Observable<any> {
    return this.http.get(this.apiUrl + 'staff/staff-details/' + staffUuId);
  }

  updateStaffMember(staffUuId: string, formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'staff/update/' + staffUuId, formData);
  }

  deleteStaffMember(staffUuId: string): Observable<any> {
    return this.http.delete(this.apiUrl + 'staff/delete/' + staffUuId);
  }

  addStaffMember(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'staff/add', formData);
  }
}
