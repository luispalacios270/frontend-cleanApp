import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
// import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // Object to validate if the user is in the inputs.
  try: object = {
    email: false,
    pass: false
  };

  // Object for inputs validations.
  loginForm: any;

  //Flag to show wether the the user and password are correct
  wrongUser: boolean = false;

  // Object to save the token from succesful login
  token: any;

  //Parameters for the login.
  user: object = {
    email: "",
    password: ""
  }

  loader: any = this.loadingCtrl.create({
    content: "Cargando"/* ,
      duration: 3000 */
  });/*  = this.loadingCtrl.create({
    content: "Cargando"
  }); */

  constructor(
    public navCtrl: NavController,
    public userServiceProvider: UserServiceProvider,
    public navParams: NavParams,
    public FormBuilder: FormBuilder,
    public toast: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.loginForm = FormBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(100), this.emailValidator,/* Validators.pattern("/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/")*/, Validators.required])],
      password: ['', Validators.required]
    });
  }

  /**
   * Validate if the value is a valid email thru regExp   
   * @param {any} control value of input   
   * @returns {object} returns an object with the attribute invalidEmail true if there is an error
   */
  emailValidator(control: any) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmail': true };
    }
  }

  presentLoading() {
    this.loader.present();
  }

  dissMissLoader() {
    this.loader.dismiss();
  }


  login() {
    // this.navCtrl.push(HomePage);
    this.user.email = this.user.email.trim();
    let loader = this.loadingCtrl.create({
      content: "Cargando"
    });
    loader.present();
    this.userServiceProvider.doLogin(this.user).then(result => {
      loader.dismiss();
      this.token = result;
      this.navCtrl.push(HomePage);
    }).catch(err => {
      loader.dismiss();
      // console.log(err);
      if (err.name === 'TimeoutError') {
        this.toast.create({
          message: 'El servidor no esta disponible',
          duration: 3000,
          position: 'bottom'
        }).present();
      } else
        this.wrongUser = true;
    });
  }
}