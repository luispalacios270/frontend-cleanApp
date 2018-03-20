import { providerParent } from "../providerParent";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { User } from "../../pages/login/models/user";
import { LoginResponse } from "./models/login.interface";

@Injectable()
export class UserServiceProvider extends providerParent {
  readonly modelEndPoint = "/Supervisors";

  constructor(public http: Http) {
    super(http);
  }

  doLogin(user: User): Promise<LoginResponse> {
    if (!user) return;
    const completeEndPoint = `${this.link + this.modelEndPoint}/login`;
    return this.postData(completeEndPoint, user);
  }
}
