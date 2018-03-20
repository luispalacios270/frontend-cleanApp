import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  NavParams,
  ViewController,
  ToastController,
  ModalController
} from "ionic-angular";
import { AreaPrividerProvider } from "../../providers/area-privider/area-privider";
import { ClientProvider } from "../../providers/client/client";
import { ItemProvider } from "../../providers/item/item";
import { CreateItemPage } from "../create-item/create-item";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "page-create-areas",
  templateUrl: "create-areas.html"
})
export class CreateAreasPage {
  user: any;
  showItems: boolean = false;

  // newAreas: Array<any>;
  oldAreas: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public areaProvider: AreaPrividerProvider,
    public itemProvider: ItemProvider,
    public clientProvider: ClientProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private translate: TranslateService
  ) {
    this.user = navParams.get("user");
    // console.log(this.user);
    if (this.user != null) {
      this.areaProvider
        .getAllInfoClient(this.user.id)
        .then((result: Array<any>) => {
          // console.log("las tales", result);
          this.oldAreas = result;
        });
      // .catch(err => console.log(err))
    }
  }

  deleteArea(area: object, i: number) {
    this.areaProvider.deleteArea(area).then(() => this.oldAreas.splice(i, 1));
  }

  updateArea(area: any, name: string) {
    const objTemp = { ...area, name };
    this.areaProvider
      .updateArea(objTemp)
      .then((result: any) => (area.name = result.name));
  }

  deleteItem(item: object, i: number, parentIndex: number) {
    this.itemProvider
      .deleteItem(item)
      .then(() => this.oldAreas[parentIndex].items.splice(i, 1));
  }

  updateItem(item: any, name: string) {
    const objTemp = { ...item, name };
    this.itemProvider
      .updateItem(objTemp)
      .then((result: any) => (item.name = result.name));
  }

  addArea(nameArea: string) {
    let objTmp: object = {
      name: nameArea,
      clientId: this.user.id
    };
    this.areaProvider
      .createArea(objTmp)
      .then(result => {
        console.log(this.oldAreas);
        console.log("area creada", result);
        // this.toastCtrl
        //   .create({
        //     message: "El área fue creada de manera correcta",
        //     duration: 3000,
        //     position: "bottom center"
        //   })
        //   .present();
        this.oldAreas.push(result);
        // console.log(this.oldAreas);
      })
      .catch(err => {
        this.toastCtrl.create({
          message: "Hubo un error al crear el área",
          duration: 3000,
          position: "bottom center"
        });
      });
  }

  presentAlertInput(title: string, option: number, parent: any) {
    let alertInfo: any = {};

    this.translate.get(`area.type.${title}`).subscribe(lang => {
      alertInfo.type = lang;
    });
    // this.translate.get("area.add").subscribe(lang => {
    //   alertInfo.add = lang;
    // });
    this.translate.get("area.alertInfo.newData").subscribe(lang => {
      alertInfo.newData = lang;
    });

    this.translate.get("area.alertInfo.placeholder").subscribe(lang => {
      alertInfo.placeholder = lang;
    });
    this.translate.get("shared.save").subscribe(lang => {
      alertInfo.save = lang;
    });
    this.translate.get("shared.cancel").subscribe(lang => {
      alertInfo.cancel = lang;
    });

    this.alertCtrl
      .create({
        title: alertInfo.type,
        message: alertInfo.newData,
        inputs: [
          {
            name: "title",
            placeholder: alertInfo.placeholder
          }
        ],
        buttons: [
          {
            text: alertInfo.cancel
          },
          {
            text: alertInfo.save,
            handler: data => {
              data = data.title;
              // console.log(data);
              switch (option) {
                case 1:
                  this.addArea(data);
                  break;
                case 2:
                  this.addItem(parent, data);
                  break;
                case 3:
                  this.addFutniture(parent, data);
                  break;
                case 4:
                  this.updateArea(parent, data);
                  break;
                case 5:
                  this.updateItem(parent, data);
                  break;

                default:
                  break;
              }
            }
          }
        ]
      })
      .present();
  }

  addItem(parent: any, nameItem: string) {
    let objTmp: object = {
      name: nameItem
    };
    this.areaProvider
      .createItems(parent.id, objTmp)
      .then(result => {
        if (parent.items != undefined) {
          parent.items.push(result);
        } else {
          parent.items = [result];
        }
        this.showItems = true;
        // this.toastCtrl
        //   .create({
        //     message: "El área fue creada de manera correcta",
        //     duration: 3000,
        //     position: "bottom center"
        //   })
        //   .present();
      })
      .catch(err => {
        this.toastCtrl.create({
          message: "Hubo un error al crear el área",
          duration: 3000,
          position: "bottom center"
        });
      });
  }

  addFutniture(parent: any, furnitureName: string) {
    let objTmp: object = {
      name: furnitureName
    };
    this.itemProvider
      .createItemFurnitures(parent.id, objTmp)
      .then(result => {
        if (parent.furniture != undefined) {
          parent.furniture.push(result);
        } else {
          parent.furniture = [result];
        }

        // this.toastCtrl
        //   .create({
        //     message: "El mueble fue creada de manera correcta",
        //     duration: 3000,
        //     position: "bottom center"
        //   })
        //   .present();
      })
      .catch(err => {
        this.toastCtrl
          .create({
            message: "Hubo un error al crear el área",
            duration: 3000,
            position: "bottom center"
          })
          .present();
      });
  }

  modifyItem(item: any) {
    let modal = this.modalCtrl.create(CreateItemPage, { item });
    modal.present();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
