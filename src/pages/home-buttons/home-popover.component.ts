import { Component } from "@angular/core";
import {
  App,
  NavController,
  ModalController,
  ViewController,
  AlertController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";

@Component({
  template: `
    <ion-list>
      <button ion-item (tap)="changeLanguage()">{{'home.popover.language' | translate}}</button>
      <button ion-item (tap)="closeAccount()">{{ 'home.popover.closeAcount' | translate}}</button>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {}

  changeLanguage(): void {
    this.translate.get("login.language").subscribe((res: string) => {
      const cosa = this.alertCtrl.create({
        title: res,
        inputs: [
          {
            type: "radio",
            label: "English",
            value: "en"
          },
          {
            type: "radio",
            label: "Español",
            value: "es"
          }
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel"
          },
          {
            text: "ok",
            handler: (data: string) => {
              this.getNewLanguage(data);
            }
          }
        ]
      });

      cosa.present();
    });
  }

  getNewLanguage(newLanguage = "en"): void {
    this.translate.use(newLanguage);
    this.storage.set("currentLang", newLanguage).then();
    this.closePopOver();
  }

  closeAccount(): void {
    this.storage.remove("currentUser");
    // this.storage.clear();
    this.app
      .getRootNav()
      .push("LoginPage")
      .then(() => {
        const index = this.app.getRootNav().getActive().index;
        this.app.getRootNav().remove(0, index);
      });
    this.closePopOver();
  }

  closePopOver(): void {
    this.viewCtrl.dismiss();
  }
}
