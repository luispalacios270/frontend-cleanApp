import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup
} from "@angular/forms";
import {
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  IonicPage
} from "ionic-angular";

import { UserServiceProvider } from "../../providers/user-service/user-service";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
import { emailValidator } from "../../utils/isValidEmail";
import { InvalidEmail, User } from "./models";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage implements OnInit {
  try = {
    email: false,
    pass: false
  };

  selectedLanguage = "";

  loginForm: FormGroup;

  wrongUser = false;

  constructor(
    public navCtrl: NavController,
    public userServiceProvider: UserServiceProvider,
    public navParams: NavParams,
    public FormBuilder: FormBuilder,
    public toast: ToastController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.FormBuilder.group({
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

  emailValidator(control: AbstractControl): InvalidEmail {
    const isValidEmail = emailValidator(control.value);
    return isValidEmail ? null : new InvalidEmail();
  }

  presentToastForErrorServer(): void {
    const toastRef = this.toast.create({
      message: "El servidor no esta disponible",
      duration: 3000,
      position: "bottom"
    });
    toastRef.present();
  }

  getNewLanguage(newLang: string): void {
    this.translate.use(newLang);
    this.storage.set("currentLang", newLang);
  }

  login(): void {
    const userInfo = <User>this.loginForm.value;
    userInfo.email = userInfo.email.trim();

    const loader = this.loadingCtrl.create({
      content: "Loading"
    });
    loader.present();

    this.userServiceProvider.doLogin(userInfo).subscribe(
      loginResult => {
        this.storage.set("currentUser", loginResult.userId);
        this.navCtrl.push("HomePage");
        loader.dismiss();
      },
      error => {
        if (error.name === "TimeoutError") this.presentToastForErrorServer();
        else this.wrongUser = true;
        loader.dismiss();
      }
    );
  }
}
