import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../appSettings'
import 'rxjs/add/operator/map';


@Injectable()
export class AreaPrividerProvider {
  link: string;
  modelEndPoint: string = '/areas';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(public http: Http) {
    this.link = AppSettings.API_ENDPOINT;
  }



  /*getItems() {
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint)
        .map(res => res.json())
        .subscribe((result) => resolve(result),
        err => reject(err));
    });
  };*/

  getItems(areaId: string) {
    let end_point: string = '/' + areaId + '/items';
    let url: string = this.link + this.modelEndPoint + end_point;
    return new Promise((resolve, reject) => {
      this.http.get(url, this.options)
        .map(res => res.json())
        .subscribe(res => resolve(res),
        err => reject(err));
    });
  };

  createArea(area: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.link + this.modelEndPoint, area, this.options)
        .map(res => res.json())
        .subscribe(res => resolve(res),
        err => reject(err));
    });
  }

  getAllInfoClient(clientId: string) {
    let end_point: string = "?filter="
    let data: object = {
      where: {
        clientId: clientId
      },
      include: {
        relation: "items",
        scope: {
          include: "furniture"
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point + JSON.stringify(data), this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  }
  
  createItems(areaId: string, item: any) {
    let end_point: string = '/' + areaId + '/items';
    let url: string = this.link + this.modelEndPoint + end_point;
    return new Promise((resolve, reject) => {
      this.http.post(url, item, this.options)
        .map(res => res.json())
        .subscribe(res => resolve(res),
        err => reject(err));
    });
  };
}
