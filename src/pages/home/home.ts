import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { ServiceDetailPage } from '../service-detail/service-detail'
import { EditServicePage } from '../edit-service/edit-service'
import { CreateUserPage } from '../create-user/create-user'
import { Storage } from '@ionic/storage';
import { ClientProvider } from '../../providers/client/client';
import * as globalVariables from '../../global'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  api: string = globalVariables.API_ENDPOINT;

  servicesList: Array<object>;

  onlyFinished: boolean = false;

  // List of services unfinished.
  servicesListActives: Array<object>;

  // List of finished services.
  servicesListFinished: Array<object>;

  // List of the current list
  selectedList: Array<object>;

  // Auxiliar Array to do the filters
  serviceListAux: Array<object>;
  searchFirlter: string;

  // currentService: string = "";

  /*  getImage(picId:string){
      return 'url('+this.api+'/containers/client-'+picId+'/download/profilePic.jpg), url('++')';
    }*/

  constructor(public navCtrl: NavController, public services: ServicesProvider, public alert: AlertController, public toast: ToastController, public storage: Storage, public clientService: ClientProvider) {
    this.updateLists(null);
  }

 /*  editClient() {
    this.clientService.getClients()
      .then((result: Array<object>) => {
        let alert = this.alert.create();
        alert.setTitle('Clientes');


        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            console.log(data);
          }
        });
        alert.present();

      })
      .catch(err => {

      });

  } */

  doOption(option: number) {
    switch (option) {
      case 0:
        this.alert.create({
          title: "Clientes"
        })

        break;

      default:
        break;
    }

  }

  showOption() {
    let alert = this.alert.create();
    alert.setTitle('Opciones');
    alert.addInput({
      type: 'radio',
      label: 'Editar Clientes',
      value: '0',
      checked: true
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
      }
    });
    alert.present();

  }

  updateLists(refresher: any) {

    this.services.getServicesWithClientsNoFinished().then((result: Array<object>) => {
      console.log("Unfinished Services", result);
      this.servicesListActives = result;
      this.selectList(this.onlyFinished);
      /*  if (!this.onlyFinished) {
         console.log("Entro a unfinished", this.onlyFinished);
         this.selectedList = this.servicesListActives;
         this.serviceListAux = this.servicesListActives;
       } */
      if (refresher != null) {
        refresher.complete();
      }

    }).catch(err => {
      if (refresher != null) {
        refresher.complete();
      }
      console.log(err);
    });

    this.services.getServicesWithClientsFinished().then((result: Array<object>) => {
      console.log("Finished Services", result);
      this.servicesListFinished = result;
      this.selectList(this.onlyFinished);
      // this.serviceListAux = result;
    }).catch(err => {
      console.log(err);
    });
  }

  createUser() {
    this.navCtrl.push(CreateUserPage);
  }

  createService() {
    this.navCtrl.push(EditServicePage, {
      service: null
    });
  }

  selectService(service) {
    this.navCtrl.push(ServiceDetailPage, {
      service: service
    });
  }

  selectList(switchList: boolean) {
    this.onlyFinished = switchList;
    console.log(this.onlyFinished);
    if (this.onlyFinished) {
      this.selectedList = this.servicesListFinished;
      this.serviceListAux = this.servicesListFinished;
    }
    if (!this.onlyFinished) {
      this.selectedList = this.servicesListActives;
      this.serviceListAux = this.servicesListActives;
    }
  }

  deleteService(serviceId: string) {
    this.alert.create({
      title: 'Eliminar Servicio',
      message: '¿Esta seguro que desea eliminar el servicio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.services.deleteService(serviceId)
              .then(result => {
                this.services.getServices().then((result: Array<object>) => {
                  // console.log("result", result);
                  // this.servicesList = result;
                  this.serviceListAux = result;
                }).catch(err => {
                  console.log(err);
                });
              })
              .catch(err => {
                this.toast.create({
                  message: 'El servicio no se pudo eliminar',
                  duration: 3000,
                  position: 'bottom'
                }).present();
              })
          }
        }
      ]
    }).present();
  }

  doRefresh(refresher) {
    this.updateLists(refresher);
  }

  doFilter() {
    /*console.log(this.searchFirlter);*/
    if (this.searchFirlter != null && this.searchFirlter != '')
      this.serviceListAux = this.selectedList.filter((item: any) => {
        return (
          item.client.realm.toLowerCase().includes(this.searchFirlter.toLowerCase()) ||
          item.client.address.toLowerCase().includes(this.searchFirlter.toLowerCase())
          // item.client.realm.toLowerCase().includes(this.searchFirlter.toLowerCase())
        );
      });
    else
      this.serviceListAux = this.selectedList;
  }

  ionViewDidEnter() {
    /* this.updateLists(); */
  }
}
