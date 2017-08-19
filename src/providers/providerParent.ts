import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http'
import { AppSettings } from '../appSettings'
import 'rxjs/add/operator/map';

@Injectable()
export class providerParent {

    protected link: string;
    protected supervisorEndPoint: string;
    protected headers = new Headers({ 'Content-Type': 'application/json' });
    protected options = new RequestOptions({ headers: this.headers });

    constructor(public http: Http) {
        this.link = AppSettings.API_ENDPOINT;
    }


    postData(url: string, data: object) {
        return new Promise((resolve, reject) => {
            this.http.post(url, data, this.options)
                .map(res => res.json())
                .subscribe(result => resolve(result),
                err => reject(err));
        });

    }
    getData(url: string) {
        return new Promise((resolve, reject) => {
            this.http.get(url, this.options)
                .map(res => res.json())
                .subscribe(result => resolve(result),
                err => reject(err));
        });
    }


}