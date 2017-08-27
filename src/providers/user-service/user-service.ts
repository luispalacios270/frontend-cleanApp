import { providerParent } from '../providerParent'
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class UserServiceProvider extends providerParent {

    modelEndPoint: string = '/Supervisors';

    constructor(public http: Http) {
        super(http);
    }

    doLogin(user: object) {
        if (!user) return;
        const completeEndPoint: string = `${this.link + this.modelEndPoint}/login`
        return this.postData(completeEndPoint, user);
    };
}