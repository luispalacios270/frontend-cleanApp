import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ClientProvider } from '../../providers/client/client';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
// @IonicPage()
@Component({
  selector: 'page-edit-service',
  templateUrl: 'edit-service.html',
})
export class EditServicePage {



  serviceId: string = "";
  service: {} = {
    address: "",
    price: 0,
    initialDate: new Date().toISOString()//,
    // clientId: ""
  }

  currentUser: string;


  clients: Array<object>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public clientService: ClientProvider,
    public serviceProvider: ServicesProvider,
    public toast: ToastController,
    public storage: Storage) {

    this.storage.get("currentUser").then((user: string) => {
      this.currentUser = user;
      this.clientService.getClients(user)
        .then((result: Array<object>) => {
          this.clients = result;
        }).catch(err => { })
    });
  }

  createService(service: {}) {
    const newService = { ...service, supervisorId: this.currentUser }
    this.serviceProvider.createNewServices(newService)
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

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad EditServicePage');
  // }

}
