import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ClientProvider } from '../../providers/client/client';
import { ServicesProvider } from '../../providers/services/services';
@IonicPage()
@Component({
  selector: 'page-edit-service',
  templateUrl: 'edit-service.html',
})
export class EditServicePage {



  serviceId: string = "";
  service: object = {
    address: "",
    price: 0,
    initialDate: new Date().toISOString()//,
    // clientId: ""
  }

  clients: Array<object>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public clientService: ClientProvider, public serviceProvider: ServicesProvider, public toast: ToastController) {
    this.clientService.getClients()
      .then((result: Array<object>) => {
        this.clients = result;
      })
      .catch(err => {

      });
  }

  createService(service: object) {
    // console.log(this.myDate);
    this.serviceProvider.createNewServices(service)
      .then((result: any) => {
        this.serviceId = result.id;
        this.toast.create({
          message: 'Servicio creado de manera correcta',
          duration: 3000,
          position: 'bottom'
        }).present();
        this.navCtrl.pop();

      })
      .catch(err => {
        console.log(err);
        this.toast.create({
          message: 'Se presentó un problema y no se pudo agregar',
          duration: 3000,
          position: 'bottom'
        }).present();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditServicePage');
  }

}
