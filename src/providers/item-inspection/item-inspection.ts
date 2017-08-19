import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http'
import { AppSettings } from '../../appSettings'
import 'rxjs/add/operator/map';

@Injectable()
export class ItemInspectionProvider {

  link: string;
  modelEndPoint: string = '/furnitureInspections';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(public http: Http) {
    this.link = AppSettings.API_ENDPOINT;
  }

  createInspection(data: object) {
    // let end_point = '/' + furnitureInspectionId;
    return new Promise((resolve, reject) => {
      this.http.post(this.link + this.modelEndPoint, data)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    })
  }


  updateFurnitureInspection(furnitureInspectionId: string, data: object) {
    let end_point = '/' + furnitureInspectionId;
    return new Promise((resolve, reject) => {
      this.http.patch(this.link + this.modelEndPoint + end_point, data)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    })
  }
}
