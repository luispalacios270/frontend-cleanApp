import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AreaPrividerProvider } from '../../providers/area-privider/area-privider'
import { ClientProvider } from '../../providers/client/client'
import { ItemProvider } from '../../providers/item/item'

/**
 * Generated class for the CreateAreasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-create-areas',
  templateUrl: 'create-areas.html',
})
export class CreateAreasPage {

  user: any;
  showItems: boolean = false

  // newAreas: Array<any>;
  oldAreas: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public areaProvider: AreaPrividerProvider, public itemProvider: ItemProvider, public clientProvider: ClientProvider, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    /*let areas = navParams.get("areas");
    if (areas != undefined)
    this.ol*/
    this.user = navParams.get("user");
    console.log(this.user);
    if (this.user != null) {
      this.areaProvider.getAllInfoClient(this.user.id)
        .then((result: Array<any>) => {
          console.log("las tales", result);
          this.oldAreas = result;
        })
        .catch(err => console.log(err))
    }
    /*if (this.oldAreas != null && this.oldAreas.length != 0)*/
  }

  addArea(nameArea: string) {
    let objTmp: object = {
      name: nameArea,
      clientId: this.user.id
    }
    this.areaProvider.createArea(objTmp)
      .then(result => {
        console.log(this.oldAreas);
        console.log("area creada", result);
        this.toastCtrl.create({
          message: "El área fue creada de manera correcta",
          duration: 3000,
          position: "bottom center"
        }).present();
        this.oldAreas.push(result);
        console.log(this.oldAreas);
      })
      .catch(err => {
        this.toastCtrl.create({
          message: "Hubo un error al crear el área",
          duration: 3000,
          position: "bottom center"
        })

      });
  }

  presentAlertInput(title: string, option: number, parent: any) {
    this.alertCtrl.create({
      title: "Agregar " + title,
      message: "Ingrese el nombre del nuevo dato",
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
            console.log("Close alert");
          }
        },
        {
          text: "Agregar",
          handler: data => {
            data = data.title;
            console.log(data);
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

              default:
                break;
            }
          }

        }
      ]
    }).present();
  }




  addItem(parent: any, nameItem: string) {
    let objTmp: object = {
      name: nameItem
    }
    this.areaProvider.createItems(parent.id, objTmp)
      .then(result => {
        if (parent.items != undefined) {
          parent.items.push(result);
        } else {
          parent.items = [result];
        }
        this.showItems = true;
        // this.oldAreas.push(result);
        this.toastCtrl.create({
          message: "El área fue creada de manera correcta",
          duration: 3000,
          position: "bottom center"
        }).present();
      })
      .catch(err => {
        this.toastCtrl.create({
          message: "Hubo un error al crear el área",
          duration: 3000,
          position: "bottom center"
        })

      });


  }

  addFutniture(parent: any, furnitureName: string) {
    let objTmp: object = {
      name: furnitureName
    }
    this.itemProvider.createItemFurnitures(parent.id, objTmp)
      .then(result => {
        if (parent.furniture != undefined) {
          parent.furniture.push(result);
        } else {
          parent.furniture = [result];
        }
        console.log(this.oldAreas);
        // this.oldAreas.push(result);
        this.toastCtrl.create({
          message: "El mueble fue creada de manera correcta",
          duration: 3000,
          position: "bottom center"
        }).present();
      })
      .catch(err => {
        console.log(err);
        this.toastCtrl.create({
          message: "Hubo un error al crear el área",
          duration: 3000,
          position: "bottom center"
        }).present();

      });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAreasPage');
  }

}
