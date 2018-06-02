import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ClientProvider } from '../../providers/client/client';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
// @IonicPage()
@Component({
  selector: 'page-edit-service',
  templateUrl: 'edit-service.html',
})
export class EditServicePage {
  serviceId = "";
  service = {
    address: "",
    price: 0,
    initialDate: new Date().toISOString()
  }

  currentUser: string;


  clients: Array<object>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public clientService: ClientProvider,
    public serviceProvider: ServicesProvider,
    public toast: ToastController,
    public storage: Storage,
    private translate: TranslateService) {

    this.storage.get("currentUser").then((user: string) => {
      this.currentUser = user;
      this.clientService.getClients(user)
        .then((result: Array<object>) => {
          this.clients = result;
        }).catch(err => { })
    });
  }

  createService(service: {}): void {
    this.translate.get('editService.createService').subscribe(lang => {

      const newService = { ...service, supervisorId: this.currentUser }
      this.serviceProvider.createNewServices(newService)
        .then((result: any) => {
          this.serviceId = result.id;
          this.toast.create({
            message: lang.created,
            duration: 3000,
            position: 'bottom'
          }).present();
          this.navCtrl.pop();

        })
        .catch(err => {
          console.log(err);
          this.toast.create({
            message: lang.error,
            duration: 3000,
            position: 'bottom'
          }).present();
        });
    })
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad EditServicePage');
  // }

}
