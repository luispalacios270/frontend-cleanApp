import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { SignaturePage } from '../signature/signature'
import { ServicesProvider } from '../../providers/services/services'
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-aprobation',
  templateUrl: 'aprobation.html',
})
export class AprobationPage {

  aprobationName: string = '';
  signatureClient: string = '';
  signatureInspector: string = '';
  service: object = {
    finished: true,
    finalDate: new Date().toISOString()
  }
  serviceId: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public alertCtrl: AlertController, public serviceProvider: ServicesProvider, public toastCtrl: ToastController, public storage: Storage) {
    this.storage.get('currentService').then(val => {
      this.serviceId = val;
    })
  }

  finishService() {
    this.serviceProvider.updateService(this.serviceId, this.service)
      .then(() => {
        this.serviceProvider.generatePDF(this.serviceId, this.signatureClient, this.signatureInspector, this.aprobationName)
          .then((result) => {
            this.alertCtrl.create({
              title: "Servicio Finalizado",
              subTitle: "El servicio fue finalizado. Se enviará un correo al usuario con la información.",
              buttons: ['OK']
            }).present();
          })
          .catch(() => {
            this.toastCtrl.create({
              message: "El servicio fue finalizado, sin embargo hubo un problema al generar el pdf. Intente más tarde.",
              duration: 9000,
              position: "bottom center"
            }).present();
          })
      })
      .catch(() => {
        this.toastCtrl.create({
          message: "Hubo un problema al finalizar el servicio",
          duration: 3000,
          position: "bottom center"
        }).present()
      })
  }
  presentAlert() {
    this.alertCtrl.create({
      title: 'Finalización de inspección',
      message: '¿Desea finalizar el servicio como esta?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Aceptar',
        handler: () => {
          this.finishService();
        }
      }]
    }).present();

  }

  showSignature(signatureContainer: number) {
    let signatureModal = this.modal.create(SignaturePage);
    signatureModal.onDidDismiss((data) => {
      if (data != null) {
        console.log("Sign Img", data);
        switch (signatureContainer) {
          case 1:
            this.signatureClient = data;
            break;
          case 2:
            this.signatureInspector = data;
            break;

          default:
            break;
        }
      }
    });
    signatureModal.present();
  }

  ionViewDidEnter() {
    this.signatureClient = '';
    this.signatureInspector = '';
    // this.signaturePad.clear()
  }

}
