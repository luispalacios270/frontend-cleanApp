import { Http, RequestOptions } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../enviroment/enviroment";

@Injectable()
export class HttpHandlerProvider {
  base_url: string = environment.baseUrl;

  constructor(public http: Http) {}

  request(observable: Observable<any>): Observable<any> {
    return observable.map(res => res.json()).timeout(5000);
  }

  postData(url: string, data: any): Observable<any> {
    return this.request(this.http.post(this.base_url + url, data));
  }

  getData(url: string): Observable<any> {
    return this.request(this.http.get(this.base_url + url));
  }

  patchData(url: string, data: any): Observable<any> {
    return this.request(this.http.patch(this.base_url + url, data));
  }

  deleteData(url: string): Observable<any> {
    return this.request(this.http.delete(this.base_url + url));
  }

  putData(url: string, data: any): Observable<any> {
    return this.request(this.http.put(this.base_url + url, data));
  }
}
