import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private http:HttpClient) { }
  upload(url:string,file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${url}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  getFiles(url:string): Observable<any> {
    return this.http.get(`${url}/files`);
  }

}
