import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  ViewController
} from "ionic-angular";

import { ItemProvider } from "../../providers/item/item";
import { TranslateService } from "@ngx-translate/core";

/**
 * Generated class for the CreateItemPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
// @IonicPage()
@Component({
  selector: "page-create-item",
  templateUrl: "create-item.html"
})
export class CreateItemPage implements OnInit {
  item: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public itemProvider: ItemProvider,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getItem();
  }

  showErr(): void {
    let errorMessage = "";

    this.translate.get("shared.error").subscribe(lang => (errorMessage = lang));

    const toast = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: "bottom center"
    });
    toast.present();
    return;
  }

  getItem() {
    this.item = this.navParams.get("item") || {};
  }

  createFurniture() {
    const option = 0;
    this.presentAlertInput("addObject", option);
  }

  deleteFurniture(furniture: any, index: number) {
    this.itemProvider
      .deleteItemFurniture(this.item.id, furniture)
      .then(result => this.item.furniture.splice(index, 1))
      .catch(err => {
        this.showErr();
        console.log(err);
      });
  }

  editFurniture(furniture: object) {
    const option = 1;
    this.presentAlertInput("updateObject", option, furniture);
  }

  addFutniture(furnitureName: string) {
    const objTmp: object = {
      name: furnitureName
    };
    this.itemProvider
      .createItemFurnitures(this.item.id, objTmp)
      .then(result => {
        let tempFurnitures = this.item.furniture;
        if (tempFurnitures) return tempFurnitures.push(result);
        return (this.item.furniture = [result]);
      })
      .catch(err => {
        this.showErr();
        // console.log(err);
      });
  }

  modifyFurniture(name: string, furniture: any) {
    const objTmp = { ...furniture, name: name };
    this.itemProvider
      .editItemFurniture(this.item.id, objTmp)
      .then((result: any) => (furniture.name = result.name))
      .catch(err => {
        this.showErr();
      });
  }

  presentAlertInput(title: string, option: number, furniture?: object) {
    let alertInfo: any = {};

    this.translate.get(`createItem.type.${title}`).subscribe(lang => {
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
              switch (option) {
                case 0:
                  this.addFutniture(data);
                  break;
                case 1:
                  this.modifyFurniture(data, furniture);
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

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
