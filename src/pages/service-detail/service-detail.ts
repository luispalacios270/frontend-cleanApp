import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ViewController, ToastController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { AreaPrividerProvider } from '../../providers/area-privider/area-privider';
import { ClientProvider } from '../../providers/client/client';
import { CreateUserPage } from '../create-user/create-user'
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-service-detail',
  templateUrl: 'service-detail.html',
})
export class ServiceDetailPage {

  // auxList: Array<any>;
  service: any;
  areas: Array<any>;
  items: Array<any>;

  selectedArea: string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams, public servicesProvider: ServicesProvider, public areaPrividerProvider: AreaPrividerProvider, public alertCtrl: AlertController, public clientService: ClientProvider, public storage: Storage, public toastCtrl: ToastController) {
    this.service = navParams.get('service');
    console.log("Servicio", this.service);
    clientService.getClientAreas(this.service.client.id)
      .then((result: Array<object>) => {
        console.log("areas", result);
        this.areas = result;
        // this.auxList = this.areas;
      }).catch(err => console.log(err));
  }

  editUser() {
    console.log(this.service.client);
    this.navCtrl.push(CreateUserPage,
      {
        user: this.service.client
      });
  }

  selectItem(item: object, areaName: string) {
    this.storage.set("currentService", this.service.id)
      .then(result => {
        console.log("Correcto");
        this.storage.set("currentItem", item)
          .then(result => {
            this.storage.set("areaName", areaName)
              .then(result => {
                this.navCtrl.push(TabsPage, {
                  navCtrl: this.navCtrl
                }
                /*, {
              item: item,
              areaName: areaName
            }*/);
              })
              .catch(err => console.log(err))

          })
          .catch(err => {
            console.log(err);
          })
        // this.currentService = result;
      })
      .catch(err => console.log(err));
  }

  selectArea(areaId: string, areaName: string) {
    this.areaPrividerProvider.getItems(areaId)
      .then((result: Array<object>) => {
        console.log("items", result);
        if (result.length == 0) {
          this.toastCtrl.create({
            message: "El area seleccionado no cuenta con items",
            duration: 3000,
            position: 'bottom center'
          }).present();

        }
        this.items = result;
        this.selectedArea = areaName;
        // this.auxList = this.items;
      })
      .catch(err => console.log(err));
  }



  /*addArea() {
    let alert = this.alertCtrl.create({
      title: 'Nueva Área',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Agregar',
          handler: data => {
            this.servicesProvider.createServiceArea(this.service.id, data)
              .then(result => {
                this.servicesProvider.getServicesAreas(this.service.id)
                  .then((result: Array<object>) => {
                    this.areas = result;
                  })
                  .catch(err => console.log(err));
              });
          }
        }
      ]
    });
    alert.present();
  }

  additem(areaId: string) {
    let alert = this.alertCtrl.create({
      title: 'Nuevo Item',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Agregar',
          handler: data => {
            let newData: object = {
              name: data.name,
              qualification: 0,
              finished: false,
              areaId: areaId
            }
            this.areaPrividerProvider.createItems(areaId, newData)
              .then(result => {
                this.servicesProvider.getServicesAreas(this.service.id)
                  .then((result: Array<object>) => {
                    this.areas = result;
                  })
                  .catch(err => console.log(err));
              });
          }
        }
      ]
    });
    alert.present();


  }*/
}

