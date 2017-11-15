import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { ClientProvider } from '../../providers/client/client'
import { FilesProvider } from '../../providers/files/files'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { CreateAreasPage } from '../create-areas/create-areas'
import * as globalVariables from '../../global'


// @IonicPage()

@Component({
  selector: 'page-create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserPage {

  api: string = globalVariables.API_ENDPOINT;

  options: CameraOptions = {
    quality: 50,
    destinationType: this.cameraCtrl.DestinationType.DATA_URL,
    encodingType: this.cameraCtrl.EncodingType.JPEG,
    mediaType: this.cameraCtrl.MediaType.PICTURE,
    correctOrientation: true
  };

  currentUser: string;

  img: string = "";


  try: object = {
    email: false,
    realm: false,
    address: false,
    phone: false
  }
  user: any = {
    email: '',
    realm: '',
    address: '',
    phone: '',
    password: '0000' //Default password
  }

  registerForm: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public clientProvider: ClientProvider,
    public files: FilesProvider,
    public cameraCtrl: Camera,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public storage: Storage) {
    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(100), this.emailValidator, Validators.required])],
      realm: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
    if (navParams.get("user") != null)
      this.user = navParams.get("user");

    this.storage.get("currentUser").then((user: string) => {
      this.currentUser = user;
    })
  }

  selectTypeOfPic() {
    this.alertCtrl.create({
      title: "Origen de imagen",
      message: "Seleccione de donde desea obtener la imagen",
      buttons: [{
        text: "Galería",
        role: "cancel",
        handler: () => {
          this.selectPictureFromGallery();
        }
      }, {
        text: "Cámara",
        handler: () => {
          this.takePicture();
        }
      }]
    }).present();
  }

  takePicture() {
    this.cameraCtrl.getPicture(this.options).then((imageData) => {
      this.img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => { })
  }

  async selectPictureFromGallery() {
    const temporalCameraOptions = {
      ...this.options,
      sourceType: this.cameraCtrl.PictureSourceType.PHOTOLIBRARY
    };

    try {
      let image = await this.cameraCtrl.getPicture(temporalCameraOptions);
      image = `data:image/jpeg;base64,${image}`;
      this.img = image;
    } catch (error) {
      console.log(error);

    }
  }

  editAreas(user: {}) {
    this.navCtrl.push(CreateAreasPage, { user });
  }



  uploadPicture(userId: string) {
    this.files.uploadProfilePic(userId, this.img)
      .then(result => {
        console.log("resultado", result);
      })
      .catch(err => console.log(err));
  }

  emailValidator(control: any) {
    //RFC 2822 compl iant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmail': true };
    }
  }

  presentConfirm(user: {}) {
    let alert = this.alertCtrl.create({
      title: 'Usuario Creado',
      message: 'El usuario se ha creado de forma correcta. ¿Desea agregar areas al usuario recién creado?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.editAreas(user);
          }
        }
      ]
    });
    alert.present();
  }


  registerUser() {
    this.user.email = this.user.email.trim();
    this.user.supervisorId = this.currentUser;
    this.clientProvider.createClient(this.user).then((result: any) => {
      if (this.img != '')
        this.uploadPicture(result.id)
      this.presentConfirm(result);
    }).catch(err => {
      // console.log(err);
      if (err.status == 422) {
        this.toastCtrl.create({
          message: "El email ingresado ya pertenece a un cliente",
          duration: 3000,
          position: "bottom center"
        }).present();
      }
    })
  }



  presentConfirmDelete() {
    this.alertCtrl.create({
      title: "Eliminación de cliente",
      message: "Esta seguro que desea eliminar el archivo",
      buttons: [
        {
          text: "No",
          role: "cancel"
        },
        {
          text: "Si",
          handler: () => {
            this.deleteUser();
          }
        }
      ]
    }).present();

    // this.clientProvider.deleteClient(this.user.id)


  }


  deleteUser() {
    this.clientProvider.deleteClientServices(this.user.id)
      .then(() => this.clientProvider.deleteClient(this.user.id))
      .then(() => this.navCtrl.popTo(this.navCtrl.getByIndex(1)))
      .catch(() => {
        this.toastCtrl.create({
          message: "Ha pasado un problema",
          duration: 3000,
          position: "bottom center"
        }).present();
      });

  }

  updateUser() {
    this.user.email = this.user.email.trim();
    this.clientProvider.updateUser(this.user.id, this.user)
      .then((result: any) => {
        if (this.img != '')
          this.uploadPicture(result.id)
        this.toastCtrl.create({
          message: "El usuario se ha actualizado de forma correcta",
          duration: 3000,
          position: "bottom center"
        }).present();
        this.navCtrl.pop();
        // this.presentConfirm(result);
      })
      .catch(err => {
        console.log(err);
        if (err.status == 422) {
          this.toastCtrl.create({
            message: "El email ingresado ya pertenece a un cliente",
            duration: 3000,
            position: "bottom center"
          }).present();
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateUserPage');
  }

}
