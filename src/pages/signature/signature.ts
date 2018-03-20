import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {

  imgSignature: string;

  signaturePadOptions: {} = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 300,
    'canvasHeight': 300
  };


  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) { }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SignaturePage');
  // }

  cancelModal() {
    this.viewCtrl.dismiss();
  }

  closeModal(picture: string) {
    this.viewCtrl.dismiss(picture);
  }


  ionViewDidEnter() {
    this.signaturePad.clear()
  }

  savePad() {
    this.imgSignature = this.signaturePad.toDataURL();
    this.signaturePad.clear();
    // console.log(this.imgSignature);
    this.closeModal(this.imgSignature);
  }

  clearPad() {
    this.signaturePad.clear();
  }

}
