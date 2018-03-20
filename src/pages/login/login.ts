import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, AbstractControl } from "@angular/forms";
import {
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  IonicPage
} from "ionic-angular";
import { HomePage } from "../home/home";
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
import { emailValidator } from "../../utils/isValidEmail";
import { User } from "./models/user";
import { FormGroup } from "@angular/forms/src/model";
import { InvalidEmail } from "./models/emailError.interface";

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

  user: User = {
    email: "",
    password: ""
  };

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

  async getNewLanguage(newLang: string): Promise<void> {
    this.translate.use(newLang);
    await this.storage.set("currentLang", newLang);
  }

  async login(): Promise<void> {
    this.user.email = this.user.email.trim();

    const loader = this.loadingCtrl.create({
      content: "Loading"
    });

    await loader.present();

    try {
      const loginResult = await this.userServiceProvider.doLogin(this.user);
      await this.storage.set("currentUser", loginResult.userId);
      await this.navCtrl.push(HomePage);
    } catch (error) {
      if (error.name === "TimeoutError") this.presentToastForErrorServer();
      else this.wrongUser = true;
    }
    await loader.dismiss();
  }
}
