import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

export interface IFileInfo {
  key: string; 
}

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {
  constructor(private http: HttpClient,private http2: HttpClientService) {}

  public uploadProgress(file: File): Observable<{ progress: number; fileInfo?: IFileInfo }> {
    const url = `${environment.apiUri}v1/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
  
    return this.http.post<IFileInfo>(url, formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event: HttpEvent<IFileInfo>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
            return { progress };
          case HttpEventType.Response:
            return { progress: 100, fileInfo: event.body || undefined }; 
          default:
            return { progress: 0 }; 
        }
      })
    );
  }


    public upload(event: any): any {
    const url = `${environment.apiUri}v1/upload`;
    if (this._isHTML5()) {
      return this._xhrTransport(url, event)!;
    }
  }

  private _isHTML5(): boolean {
    return !!((<any>window).File && (<any>window).FormData);
  }

  private _xhrTransport(url: string, event: Event): Observable<IFileInfo> | null {
    const fileList: FileList = (<any>event).files!;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      return this.http2.upload<IFileInfo>(url, formData);
    }
    return null;
  }
  
}

