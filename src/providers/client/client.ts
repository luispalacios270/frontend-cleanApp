import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../appSettings'
import 'rxjs/add/operator/map';

/*
  Generated class for the ClientProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ClientProvider {

  link: string;
  modelEndPoint: string = '/clients';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(public http: Http) {
    this.link = AppSettings.API_ENDPOINT;
  }

  updateUser(userId: string, user: object) {
    let end_point = "/" + userId
    return new Promise((resolve, reject) => {
      this.http.patch(this.link + this.modelEndPoint + end_point, user, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });

  }

  createClient(data: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.link + this.modelEndPoint, data, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  }

  deleteClient(clientId: string) {
    const endPoint: string = `${this.link + this.modelEndPoint}/${clientId}/services`;
    return new Promise((resolve, reject) => {
      this.http.delete(endPoint, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });

  }

  getClientAreas(clientId: string) {
    let end_point: string = "/" + clientId + "/areas"
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint + end_point, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  }



  getClients() {
    return new Promise((resolve, reject) => {
      this.http.get(this.link + this.modelEndPoint, this.options)
        .map(res => res.json())
        .subscribe(result => resolve(result)
        , err => reject(err));
    });
  }

}
