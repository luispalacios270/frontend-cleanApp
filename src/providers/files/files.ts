import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../appSettings';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';




/*
  Generated class for the FilesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FilesProvider {
  link: string;
  modelEndPoint: string = '/containers';
  /* Content-Type:application/x-www-form-urlencoded; charset=UTF-8 */
  headers = new Headers({ 'Content-Type': 'application/json' });
  headersFile = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  });
  options = new RequestOptions({ headers: this.headers });
  optionsFile = new RequestOptions({ headers: this.headersFile });

  constructor(private http: Http) {
    this.link = AppSettings.API_ENDPOINT;
  }

  uploadPic(base64Img: string, container: string, fileName: string) {
    let data: object = {
      base64Img: base64Img,
      container: container,
      fileName: fileName
    };
    /* if (fileName != null)
      data.fileName = fileName; */
    let end_point = '/uploadPic';
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.link + this.modelEndPoint + end_point,
          JSON.stringify(data),
          this.options
        )
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  uploadProfilePic(userId: string, data: string) {
    let tmpContainerName: string = 'client-' + userId;
    let fileName = 'profilePic.jpg';
    return this.uploadPic(data, tmpContainerName, fileName);
  }

  uploadBeforePic(furnitureId: string, data: string) {
    let tmpContainerName: string = 'picBefore-' + furnitureId;
    // let fileName = "";
    return this.uploadPic(data, tmpContainerName, '');
  }

  uploadAfterPic(furnitureId: string, data: string) {
    let tmpContainerName: string = 'picAfter-' + furnitureId;
    // let fileName = "";
    return this.uploadPic(data, tmpContainerName, '');
  }

  getBeforePics(furnitureId: string) {
    let end_point = '/picBefore-' + furnitureId + '/files';
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  getAfterPics(furnitureId: string) {
    let end_point = '/picAfter-' + furnitureId + '/files';
    return new Promise((resolve, reject) => {
      this.http
        .get(this.link + this.modelEndPoint + end_point, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result), err => reject(err));
    });
  }

  isThereBeforePics(furnitureId: string): Observable<number> {
    const end_pointForBefore = `/picBefore-${furnitureId}`;
    return this.http
      .get(this.link + this.modelEndPoint + end_pointForBefore, this.options)
      .map(res => res.json())
      // .pipe(take(1), mapTo(1), catchError(() => of(0)));
  }

  isThereAfterPics(furnitureId: string): Observable<number> {
    const end_pointForAfter = `/picAfter-${furnitureId}`;
    return this.http
      .get(this.link + this.modelEndPoint + end_pointForAfter, this.options)
      .map(res => res.json())
      // .pipe(take(1), mapTo(1), catchError(() => of(0)));
  }


}
