import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http'
import { AppSettings } from '../../appSettings'
/*import { providerParent } from '../providerParent'*/
import 'rxjs/add/operator/map';

@Injectable()
export class UserServiceProvider {

  link: string;
  supervisorEndPoint: string = '/Supervisors';

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  // constructor()

  constructor(public http: Http) {
    this.link = AppSettings.API_ENDPOINT;
  }

  /**
   * 
   * @param user object with the parameters to get accessToken.
   */
  doLogin(user: object) {
    if (user != null || user != undefined) {
      var loginEndPoint: string = "/login";
      return new Promise((resolve, reject) => {
        this.http.post(this.link + this.supervisorEndPoint + loginEndPoint, JSON.stringify(user), this.options)
          .map(res => res.json()).subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    } else {
      return;
    }
  };
}