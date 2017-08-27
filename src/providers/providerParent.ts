import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http'
import { AppSettings } from '../appSettings'
import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/map';

@Injectable()
export class providerParent {

    protected modelEndPoint: string;
    protected link: string = AppSettings.API_ENDPOINT;
    protected headers = new Headers({ 'Content-Type': 'application/json' });
    protected options = new RequestOptions({ headers: this.headers });

    constructor(
        public http: Http
    ) { }

    doRequest(callback: any) {
        return new Promise((resolve, reject) => {
            callback
                .timeout(5000)
                .map(res => res.json())
                .subscribe(result => resolve(result),
                err => reject(err));
        });
    }


    postData(url: string, data: object) {
        const callback = this.http.post(url, data, this.options);
        return this.doRequest(callback);
    }

    getData(url: string) {
        const callback = this.http.get(url, this.options)
        return this.doRequest(callback);
    }

    patchData(url: string, data: any) {
        const callback = this.http.patch(url, data, this.options);
        return this.doRequest(callback);
    }


    deleteData(url: string) {
        const callback = this.http.delete(url, this.options)
        return this.doRequest(callback);
    }

    putData(url: string, data: any) {
        const callback = this.http.put(url, data, this.options);
        return this.doRequest(callback);
    }


}