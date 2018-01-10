import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ToastController
} from "ionic-angular";
import { ClientProvider } from "../../providers/client/client";
import { FilesProvider } from "../../providers/files/files";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Storage } from "@ionic/storage";
import { CreateAreasPage } from "../create-areas/create-areas";
import * as globalVariables from "../../global";
import { TranslateService } from "@ngx-translate/core";

// @IonicPage()

@Component({
  selector: "page-create-user",
  templateUrl: "create-user.html"
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
  };
  user: any = {
    email: "",
    realm: "",
    address: "",
    phone: "",
    password: "0000" //Default password
  };

  registerForm: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public clientProvider: ClientProvider,
    public files: FilesProvider,
    public cameraCtrl: Camera,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public storage: Storage,
    private translate: TranslateService
  ) {
    this.registerForm = formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.maxLength(100),
          this.emailValidator,
          Validators.required
        ])
      ],
      realm: ["", Validators.required],
      address: ["", Validators.required],
      phone: ["", Validators.required]
    });
    if (navParams.get("user") != null) this.user = navParams.get("user");

    this.storage.get("currentUser").then((user: string) => {
      this.currentUser = user;
    });
  }

  selectTypeOfPic() {
    let selectPic: any = {};
    this.translate
      .get("user.selectPic.source")
      .subscribe(lang => (selectPic.title = lang));
    this.translate
      .get("user.selectPic.message")
      .subscribe(lang => (selectPic.message = lang));
    this.translate
      .get("user.selectPic.gallery")
      .subscribe(lang => (selectPic.gallery = lang));
    this.translate
      .get("user.selectPic.camera")
      .subscribe(lang => (selectPic.camera = lang));
    this.alertCtrl
      .create({
        title: selectPic.title,
        message: selectPic.message,
        buttons: [
          {
            text: selectPic.gallery,
            handler: () => {
              this.selectPictureFromGallery();
            }
          },
          {
            text: selectPic.camera,
            handler: () => {
              this.takePicture();
            }
          }
        ]
      })
      .present();
  }

  takePicture() {
    this.cameraCtrl.getPicture(this.options).then(
      imageData => {
        this.img = "data:image/jpeg;base64," + imageData;
      },
      err => {}
    );
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
    this.files
      .uploadProfilePic(userId, this.img)
      .then(result => {})
      .catch(err => console.log(err));
  }

  emailValidator(control: any) {
    //RFC 2822 compl iant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmail: true };
    }
  }

  presentConfirm(user: {}) {
    let createdUser: any = {};
    this.translate
      .get("user.createdUser.title")
      .subscribe(lang => (createdUser.title = lang));
    this.translate
      .get("user.createdUser.message")
      .subscribe(lang => (createdUser.message = lang));

    let alert = this.alertCtrl.create({
      title: createdUser.title,
      message: createdUser.message,
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: "Ok",
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
    this.clientProvider
      .createClient(this.user)
      .then((result: any) => {
        if (this.img != "") this.uploadPicture(result.id);
        this.presentConfirm(result);
      })
      .catch(err => {
        let messageUsedEmail: string;
        this.translate
          .get("user.emailUsed")
          .subscribe(lang => (messageUsedEmail = lang));
        // console.log(err);
        if (err.status == 422) {
          this.toastCtrl
            .create({
              message: messageUsedEmail,
              duration: 3000,
              position: "bottom center"
            })
            .present();
        }
      });
  }

  presentConfirmDelete() {
    let deletClient: any = {};
    this.translate.get("user.deletClient.title").subscribe(lang => {
      deletClient.title = lang;
    });
    this.translate.get("user.deletClient.message").subscribe(lang => {
      deletClient.message = lang;
    });

    this.alertCtrl
      .create({
        title: deletClient.title,
        message: deletClient.message,
        buttons: [
          {
            text: "No"
          },
          {
            text: "Ok",
            handler: () => {
              this.deleteUser();
            }
          }
        ]
      })
      .present();

    // this.clientProvider.deleteClient(this.user.id)
  }

  deleteUser() {
    this.clientProvider
      .deleteClientServices(this.user.id)
      .then(() => this.clientProvider.deleteClient(this.user.id))
      .then(() => this.navCtrl.popTo(this.navCtrl.getByIndex(1)))
      .catch(() => {
        this.toastCtrl
          .create({
            message: "Ha pasado un problema",
            duration: 3000,
            position: "bottom center"
          })
          .present();
      });
  }

  updateUser() {
    let userCreated: string;
    this.translate.get("user.userCreated").subscribe(lang => {
      userCreated = lang;
    });

    this.user.email = this.user.email.trim();
    this.clientProvider
      .updateUser(this.user.id, this.user)
      .then((result: any) => {
        if (this.img != "") this.uploadPicture(result.id);
        this.toastCtrl
          .create({
            message: userCreated,
            duration: 3000,
            position: "bottom center"
          })
          .present();
        this.navCtrl.pop();
      })
      .catch(err => {
        console.log(err);
        if (err.status == 422) {
          let messageUsedEmail: string;
          this.translate
            .get("user.emailUsed")
            .subscribe(lang => (messageUsedEmail = lang));

          this.toastCtrl
            .create({
              message: messageUsedEmail,
              duration: 3000,
              position: "bottom center"
            })
            .present();
        }
      });
  }
}
