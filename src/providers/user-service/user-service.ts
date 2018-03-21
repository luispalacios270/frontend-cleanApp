import { Injectable } from "@angular/core";
import { HttpHandlerProvider } from "../http-handler/http-handler";
import { User } from "../../pages/login/models";
import { LoginResponse } from "./models/login.interface";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserServiceProvider {
  readonly modelEndPoint = "/Supervisors";

  constructor(public httpHandler: HttpHandlerProvider) {}

  doLogin(user: User): Observable<LoginResponse> {
    if (!user) return;
    const completeEndPoint = `${this.modelEndPoint}/login`;
    return this.httpHandler.postData(completeEndPoint, user);
  }
}
