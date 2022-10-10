import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  static cleanFileName(fileName: string): string {
    // Get the file extension and filename without it
    let fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    let fileNameNoExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    // Convert both of the values to lower case
    fileExtension = fileExtension.toLowerCase();
    fileNameNoExtension = fileNameNoExtension.toLowerCase();
    // Get rid of all no alphanumeric characters from the string
    fileNameNoExtension = fileNameNoExtension.replace(/\W/g, '');
    // If the filename was all no alphanumeric then add no_file_name
    if (fileNameNoExtension.length === 0) {
      fileNameNoExtension = 'nofilename';
    }
    // Generate a random string for the file name
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return fileNameNoExtension + '_' + randomString + '.' + fileExtension;
  }
}
