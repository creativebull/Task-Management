import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  static validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];

  constructor() {
  }

  static validImage(file: any): boolean {
    return this.validImageTypes.includes(file.type);
  }
}
