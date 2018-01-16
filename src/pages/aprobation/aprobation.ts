import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ToastController
} from "ionic-angular";
import { SignaturePage } from "../signature/signature";
import { ServicesProvider } from "../../providers/services/services";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";

// @IonicPage()
@Component({
  selector: "page-aprobation",
  templateUrl: "aprobation.html"
})
export class AprobationPage {
  aprobationName = "";
  signatureClient = "";
  signatureInspector = "";

  service = {
    finished: true,
    finalDate: new Date().toISOString()
  };
  serviceId = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modal: ModalController,
    public alertCtrl: AlertController,
    public serviceProvider: ServicesProvider,
    public toastCtrl: ToastController,
    public storage: Storage,
    private translateService: TranslateService
  ) {
    this.storage.get("currentService").then(val => {
      this.serviceId = val;
    });
  }

  finishService(): void {
    this.translateService.get("approbation.inspectionEnded").subscribe(lang => {
      this.serviceProvider
        .updateService(this.serviceId, this.service)
        .then(resultService => {
          this.serviceProvider
            .generatePDF(
              resultService,
              this.signatureClient,
              this.signatureInspector,
              this.aprobationName
            )
            .then(result => {
              this.alertCtrl
                .create({
                  title: lang.title,
                  subTitle: lang.message,
                  buttons: ["OK"]
                })
                .present();
            })
            .catch(() => {
              this.toastCtrl
                .create({
                  message: lang.pdfError,
                  duration: 9000,
                  position: "bottom center"
                })
                .present();
            });
        })
        .catch(() => {
          this.toastCtrl
            .create({
              message: lang.inspectionError,
              duration: 3000,
              position: "bottom center"
            })
            .present();
        });
    });
  }
  presentAlert(): void {
    this.translateService.get("approbation.endInspection").subscribe(lang => {
      this.alertCtrl
        .create({
          title: lang.title,
          message: lang.message,
          buttons: [
            {
              text: lang.cancel
            },
            {
              text: "Ok",
              handler: () => {
                this.finishService();
              }
            }
          ]
        })
        .present();
    });
  }

  showSignature(signatureContainer: number): void {
    let signatureModal = this.modal.create(SignaturePage);
    signatureModal.onDidDismiss(data => {
      if (data != null) {
        console.log("Sign Img", data);
        switch (signatureContainer) {
          case 1:
            this.signatureClient = data;
            break;
          case 2:
            this.signatureInspector = data;
            break;

          default:
            break;
        }
      }
    });
    signatureModal.present();
  }

  ionViewDidEnter(): void {
    this.signatureClient = "";
    this.signatureInspector = "";
  }
}
