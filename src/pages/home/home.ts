import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  ToastController,
  PopoverController,
  IonicPage
} from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";
import { ServiceDetailPage } from "../service-detail/service-detail";
import { EditServicePage } from "../edit-service/edit-service";
import { CreateUserPage } from "../create-user/create-user";
import { PopoverPage } from "../home-buttons/home-popover.component";
import { Storage } from "@ionic/storage";
import { ClientProvider } from "../../providers/client/client";

import * as globalVariables from "../../global";
import { Client } from "../../providers/client/model/client.interface";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  clients: Client[];

  clientsFiltered: any[];

  api = globalVariables.API_ENDPOINT;

  segment = "0";

  servicesList: any[];

  onlyFinished: boolean = false;

  // List of services unfinished.
  servicesListActives: any[];

  // List of finished services.
  servicesListFinished: any[];

  // List of the current list
  selectedList: any[];

  // Auxiliar Array to do the filters
  serviceListAux: any[];

  searchFirlter: string;

  constructor(
    public navCtrl: NavController,
    public services: ServicesProvider,
    public alert: AlertController,
    public toast: ToastController,
    public storage: Storage,
    public clientService: ClientProvider,
    public popoverCtrl: PopoverController
  ) {}

  presentPopover(event: Event): void {
    const popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev: event });
  }

  updateLists(refresher: any): void {
    this.storage
      .get("currentUser")
      .then((user: string) => {
        this.services
          .getServicesWithClientsNoFinished(user)
          .then((result: Array<object>) => {
            this.servicesListActives = result;
            this.selectList();
            if (refresher != null) {
              refresher.complete();
            }
          })
          .catch(err => {
            if (refresher != null) {
              refresher.complete();
            }
          });

        this.services
          .getServicesWithClientsFinished(user)
          .then((result: Array<object>) => {
            this.servicesListFinished = result;
            this.selectList();
          })
          .catch(err => {
            if (refresher) refresher.complete();
          });

        this.updateClients(user);
      })
      .catch(err => console.error(err));
  }

  updateClients(user: string): void {
    this.clientService
      .getClients(user)
      .then((resp: Array<any>) => {
        this.clients = resp;
        this.clientsFiltered = resp;
      })
      .catch(err => console.log(err));
  }

  goToClientPage(client?): void {
    const userToModify = client ? { user: client } : undefined;
    this.navCtrl.push(CreateUserPage, userToModify);
  }

  createService(): void {
    this.navCtrl.push(EditServicePage, {
      service: null
    });
  }

  selectService(service): void {
    this.navCtrl.push(ServiceDetailPage, {
      service: service
    });
  }

  selectList(): void {
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
  }

  deleteService(serviceId: string): void {
    this.alert
      .create({
        title: "Eliminar Servicio",
        message: "¿Esta seguro que desea eliminar el servicio?",
        buttons: [
          {
            text: "No",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          },
          {
            text: "Eliminar",
            handler: () => {
              this.services
                .deleteService(serviceId)
                .then(result => {
                  this.services
                    .getServices()
                    .then((result: Array<object>) => {
                      this.serviceListAux = result;
                    })
                    .catch(err => {
                      console.log(err);
                    });
                })
                .catch(err => {
                  this.toast
                    .create({
                      message: "El servicio no se pudo eliminar",
                      duration: 3000,
                      position: "bottom"
                    })
                    .present();
                });
            }
          }
        ]
      })
      .present();
  }

  doRefresh(refresher): void {
    this.updateLists(refresher);
  }

  filterToFindMatchItem(item): boolean {
    const doesItemMatch =
      item.client.realm
        .toLowerCase()
        .includes(this.searchFirlter.toLowerCase()) ||
      item.client.address
        .toLowerCase()
        .includes(this.searchFirlter.toLowerCase());

    return doesItemMatch;
  }

  filterToFindMatchClient(client): boolean {
    const doesClientMatch =
      client.realm.toLowerCase().includes(this.searchFirlter.toLowerCase()) ||
      client.address.toLowerCase().includes(this.searchFirlter.toLowerCase());

    return doesClientMatch;
  }

  doFilter(): void {
    if (!this.searchFirlter) {
      this.serviceListAux = this.selectedList;
      this.clientsFiltered = this.clients;
      return;
    }
    this.serviceListAux = this.selectedList.filter(this.filterToFindMatchItem);
    this.clientsFiltered = this.clients.filter(this.filterToFindMatchClient);
  }

  ionViewDidEnter(): void {
    this.updateLists(null);
  }
}
