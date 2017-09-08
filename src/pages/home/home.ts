import { Component, OnInit } from '@angular/core';
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
export class HomePage implements OnInit {

  clients: Array<any>;

  clientsFiltered: Array<any>;

  api: string = globalVariables.API_ENDPOINT;

  segment: string = '0';



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


  constructor(
    public navCtrl: NavController,
    public services: ServicesProvider,
    public alert: AlertController,
    public toast: ToastController,
    public storage: Storage,
    public clientService: ClientProvider,

  ) { }

  ngOnInit() {
    this.updateLists(null);
  }







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

  modifyUser(client) {
    this.navCtrl.push(CreateUserPage, { user: client });
  }

  updateLists(refresher: any) {

    this.services.getServicesWithClientsNoFinished().then((result: Array<object>) => {
      this.servicesListActives = result;
      this.selectList();
      if (refresher != null) {
        refresher.complete();
      }
    }).catch(err => {
      if (refresher != null) {
        refresher.complete();
      }

    });
    this.services.getServicesWithClientsFinished().then((result: Array<object>) => {

      this.servicesListFinished = result;
      this.selectList();

    }).catch(err => {

    });

    this.updateClients();


  }

  updateClients() {
    this.clientService.getClients()
      .then((resp: Array<any>) => {
        this.clients = resp;
        this.clientsFiltered = resp;
      })
      .catch(err => console.log(err));
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

  /*  test(testVariable: boolean = false) {
     return testVariable;
   } */

  selectList() {
    const option = Number(this.segment);
    switch (option) {
      case 0:
        this.selectedList = this.servicesListActives;
        this.serviceListAux = this.servicesListActives;
        break;
      case 1:
        this.selectedList = this.servicesListFinished;
        this.serviceListAux = this.servicesListFinished;
        break;
      case 2:
        this.selectedList = this.servicesListFinished;
        this.serviceListAux = this.servicesListFinished;
        break;
      default:
        this.selectedList = this.servicesListActives;
        this.serviceListAux = this.servicesListActives;
        break;

    }
    return;/* 




    if (this.onlyFinished) {
      this.selectedList = this.servicesListFinished;
      this.serviceListAux = this.servicesListFinished;
    }
    if (!this.onlyFinished) {
      this.selectedList = this.servicesListActives;
      this.serviceListAux = this.servicesListActives;
    } */
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
    if (this.searchFirlter != null && this.searchFirlter != '') {
      this.serviceListAux = this.selectedList.filter((item: any) => {
        return (
          item.client.realm.toLowerCase().includes(this.searchFirlter.toLowerCase()) ||
          item.client.address.toLowerCase().includes(this.searchFirlter.toLowerCase())
        );
      });
      this.clientsFiltered = this.clients.filter((client) => {
        return (client.realm.toLowerCase().includes(this.searchFirlter.toLowerCase()) ||
          client.address.toLowerCase().includes(this.searchFirlter.toLowerCase()))
      });
    }
    else {
      this.serviceListAux = this.selectedList;
      this.clientsFiltered = this.clients;
    }
  }

  ionViewDidEnter() {

  }
}
