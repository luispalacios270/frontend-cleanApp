import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ViewController,
  ToastController
} from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";
import { AreaPrividerProvider } from "../../providers/area-privider/area-privider";
import { ClientProvider } from "../../providers/client/client";
import { CreateUserPage } from "../create-user/create-user";
import { TabsPage } from "../tabs/tabs";
import { Storage } from "@ionic/storage";

// import { File } from "@ionic-native/file";
import { SocialSharing } from "@ionic-native/social-sharing";

import * as globalVariables from "../../global";

@Component({
  selector: "page-service-detail",
  templateUrl: "service-detail.html"
})
export class ServiceDetailPage {
  service: any;
  areas: Array<any>;
  items: Array<any>;
  api: string = globalVariables.API_ENDPOINT;
  selectedArea: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicesProvider: ServicesProvider,
    public areaPrividerProvider: AreaPrividerProvider,
    public alertCtrl: AlertController,
    public clientService: ClientProvider,
    public storage: Storage,
    public toastCtrl: ToastController,
    // private transfer: FileTransfer,
    // private file: File,
    private socialSharing: SocialSharing
  ) {
    this.service = navParams.get("service");
    clientService
      .getClientAreas(this.service.client.id)
      .then((result: Array<object>) => {
        this.areas = result;
      })
      .catch(err => console.log(err));
  }

  editUser() {
    this.navCtrl.push(CreateUserPage, {
      user: this.service.client
    });
  }

  downloadPdf(service: any) {
    const url: string = `${this.api}/containers/pdf/download/${service.id}.pdf`;
    this.socialSharing
      .share("Compartir PDF", null, url)
      .then()
      .catch(err => {
        this.toastCtrl
          .create({
            duration: 3000,
            message: "El PDF no se encuentra generado aún",
            position: "bottom"
          })
          .present();
      });
  }

  /* downloadPdf(service: any) {
    const url: string = `${this.api}/containers/pdf/download/${service.id}.pdf`;
    this.fileTransfer.download(url, this.file.externalRootDirectory + 'file.pdf').then((entry) => {
      this.toastCtrl.create({
        duration: 3000,
        message: "Descarga finalizada",
        position: "bottom"
      }).present();
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      this.toastCtrl.create({
        duration: 3000,
        message: "Hubo un error",
        position: "bottom"
      }).present();
    });
  } */

  selectItem(item: object, areaName: string) {
    this.storage
      .set("currentService", this.service.id)
      .then(result => {
        console.log("Correcto");
        this.storage
          .set("currentItem", item)
          .then(result => {
            this.storage
              .set("areaName", areaName)
              .then(result => {
                this.navCtrl.push(TabsPage, {
                  navCtrl: this.navCtrl
                });
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => console.log(err));
  }

  selectArea(areaId: string, areaName: string) {
    this.areaPrividerProvider
      .getItems(areaId)
      .then((result: Array<object>) => {
        if (result.length == 0) {
          this.toastCtrl
            .create({
              message: "El area seleccionado no cuenta con items",
              duration: 3000,
              position: "bottom center"
            })
            .present();
        }
        this.items = result;
        this.selectedArea = areaName;
      })
      .catch(err => console.log(err));
  }
}
