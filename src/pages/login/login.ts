import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { HomePage } from "../home/home";
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  try: {} = {
    email: false,
    pass: false
  };

  selectedLanguage = "";

  loginForm: any;

  wrongUser: boolean = false;

  token: any;

  user: any = {
    email: "",
    password: ""
  };

  loader: any = this.loadingCtrl.create({
    content: "Cargando"
  });

  constructor(
    public navCtrl: NavController,
    public userServiceProvider: UserServiceProvider,
    public navParams: NavParams,
    public FormBuilder: FormBuilder,
    public toast: ToastController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public translate: TranslateService
  ) {
    this.loginForm = FormBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.maxLength(100),
          this.emailValidator,
          ,
          Validators.required
        ])
      ],
      password: ["", Validators.required]
    });
  }

  /**
   * Validate if the value is a valid email thru regExp
   * @param {any} control value of input
   * @returns {object} returns an object with the attribute invalidEmail true if there is an error
   */
  emailValidator(control: any) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmail: true };
    }
  }

  presentLoading() {
    this.loader.present();
  }

  dissMissLoader() {
    this.loader.dismiss();
  }

  getNewLanguage($event): void {
    this.translate.use($event);
  }

  login() {
    let emailTrimmed: string = this.user.email;
    emailTrimmed = emailTrimmed.trim();
    this.user.email = emailTrimmed;
    let loader = this.loadingCtrl.create({
      content: "Loading"
    });
    loader.present();
    this.userServiceProvider
      .doLogin(this.user)
      .then((result: any) => {
        loader.dismiss();
        this.storage.set("currentUser", result.userId);
        this.navCtrl.push(HomePage);
      })
      .catch(err => {
        loader.dismiss();
        if (err.name === "TimeoutError") {
          this.toast
            .create({
              message: "El servidor no esta disponible",
              duration: 3000,
              position: "bottom"
            })
            .present();
        } else this.wrongUser = true;
      });
  }
}
