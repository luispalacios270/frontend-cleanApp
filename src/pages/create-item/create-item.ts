import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ViewController } from 'ionic-angular';

import { ItemProvider } from '../../providers/item/item'

/**
 * Generated class for the CreateItemPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
// @IonicPage()
@Component({
  selector: 'page-create-item',
  templateUrl: 'create-item.html',
})
export class CreateItemPage implements OnInit {

  item: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public itemProvider: ItemProvider,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController
  ) { }

  ngOnInit() {
    this.getItem();
  }

  showErr() {
    const toast = this.toastCtrl.create({
      message: "Hubo un error, intente más tarde",
      duration: 3000,
      position: "bottom center"
    });
    toast.present();
    return;
  }

  getItem() {
    this.item = this.navParams.get('item') || {};
    // console.log(this.item);
  }

  createFurniture() {

    const option: number = 0;
    this.presentAlertInput("Crear Objeto", option);
  }

  deleteFurniture(furniture: any, index: number) {
    this.itemProvider.deleteItemFurniture(this.item.id, furniture)
      .then(result => this.item.furniture.splice(index, 1))
      .catch(err => {
        this.showErr();
        console.log(err)
      });
  }

  editFurniture(furniture: object) {
    const option: number = 1;
    this.presentAlertInput("Editar Objeto", option, furniture);
  }

  addFutniture(furnitureName: string) {
    const objTmp: object = {
      name: furnitureName
    }
    this.itemProvider.createItemFurnitures(this.item.id, objTmp)
      .then(result => {
        let tempFurnitures = this.item.furniture;
        if (tempFurnitures) return tempFurnitures.push(result);
        return this.item.furniture = [result];
      })
      .catch(err => {
        this.showErr();
        // console.log(err);

      });
  }

  modifyFurniture(name: string, furniture: any) {
    const objTmp = { ...furniture, name: name }
    this.itemProvider.editItemFurniture(this.item.id, objTmp)
      .then((result: any) => furniture.name = result.name)
      .catch(err => {
        this.showErr();
      });
  }



  presentAlertInput(title: string, option: number, furniture?: object) {
    this.alertCtrl.create({
      title: title,
      message: "Ingrese el nombre dato",
      inputs: [
        {
          name: 'title',
          placeholder: 'Ej: Piso 16, Oficina 1504, Baño Principal'
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: data => {
            // console.log("Close alert");
          }
        },
        {
          text: "Guardar",
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
            /* if (furniture) return
            callback(data); */
          }

        }
      ]
    }).present();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }





  /* ionViewDidLoad() {
    console.log('ionViewDidLoad CreateItemPage');
  } */

}
