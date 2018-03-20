import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  ActionSheetController,
  ToastController,
  Slides,
  ModalController,
  AlertController
} from "ionic-angular";
import { ItemProvider } from "../../providers/item/item";
import { FilesProvider } from "../../providers/files/files";
import { ItemInspectionProvider } from "../../providers/item-inspection/item-inspection";
import { NotesPage } from "../notes/notes";
import { HomePage } from "../home/home";
import { PicturePage } from "../picture/picture";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "page-item-detail",
  templateUrl: "item-detail.html"
})
export class ItemDetailPage {
  @ViewChild(Slides) slides: Slides;

  serviceId: any;
  item: any;
  areaName: string;
  furnitures: Array<any>;

  options: CameraOptions = {
    quality: 50,
    destinationType: this.cameraCtrl.DestinationType.DATA_URL,
    encodingType: this.cameraCtrl.EncodingType.JPEG,
    mediaType: this.cameraCtrl.MediaType.PICTURE,
    correctOrientation: true
  };

  optionsGallery: CameraOptions = {
    quality: 50,
    destinationType: this.cameraCtrl.DestinationType.DATA_URL,
    encodingType: this.cameraCtrl.EncodingType.JPEG,
    mediaType: this.cameraCtrl.MediaType.PICTURE,
    correctOrientation: true,
    sourceType: this.cameraCtrl.PictureSourceType.PHOTOLIBRARY
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemProvider: ItemProvider,
    public actionSheet: ActionSheetController,
    private cameraCtrl: Camera,
    public storage: Storage,
    public modalCtrl: ModalController,
    public toast: ToastController,
    public inspectionProvider: ItemInspectionProvider,
    public filesProvider: FilesProvider,
    public alertCtrl: AlertController,
    private translate: TranslateService
  ) {
    this.init();
    console.log(this.navCtrl);
  }

  selectService() {
    this.navCtrl.insert(0, HomePage);
    this.navCtrl.pop();
  }

  init() {
    this.storage.get("currentItem").then(val => {
      this.item = val;
      this.storage.get("areaName").then(areaName => {
        this.areaName = areaName;
        this.updateFurnitures();
      });
    });
    // this.item = this.navParams.get("item");
    // this.areaName = this.navParams.get("areaName");
  }

  updateFurnitures() {
    this.storage.get("currentService").then(val => {
      console.log("valor", val);
      this.serviceId = val;
      this.itemProvider
        .getFurnitures(this.item.id, val)
        .then((result: Array<object>) => {
          console.log("Furnitures", result);
          this.furnitures = result;
        })
        .catch(err => console.log("error", err));
    });
  }

  goToSlide(furnitureId: string, isBeforePic: boolean) {
    // this.slides.slideTo(2, 500);
    let profileModal = this.modalCtrl.create(PicturePage, {
      furnitureId: furnitureId,
      isBeforePic: isBeforePic
    });
    profileModal.present();
    console.log(furnitureId);
  }

  rankFurniture(furniture: any, qualification: number) {
    if (furniture.furnitureInspections.length > 0) {
      let data = furniture.furnitureInspections[0];
      this.inspectionProvider
        .updateFurnitureInspection(data.id, { qualification: qualification })
        .then(result => {
          console.log();
          furniture.furnitureInspections[0] = result;
        })
        .catch(err => {
          console.log(err);
          this.toast
            .create({
              message: "Hubo un error",
              duration: 3000,
              position: "bottom center"
            })
            .present();
        });
    } else {
      let data = {
        furnitureId: furniture.id,
        serviceId: this.serviceId,
        qualification: qualification
      };
      this.inspectionProvider
        .createInspection(data)
        .then(result => {
          console.log();
          furniture.furnitureInspections[0] = result;
        })
        .catch(err => {
          console.log(err);
          this.toast
            .create({
              message: "Hubo un error",
              duration: 3000,
              position: "bottom center"
            })
            .present();
        });
    }
  }

  getNotes(furnitureInspection) {
    if (furnitureInspection.length === 0) return 0;
    else {
      let counter: number = 0;
      if (furnitureInspection[0].notesActionPlan !== "")
        counter += furnitureInspection[0].notesActionPlan.split("\n").length;
      if (furnitureInspection[0].notesAdministrator !== "")
        counter += furnitureInspection[0].notesAdministrator.split("\n").length;
      if (furnitureInspection[0].notesClient !== "")
        counter += furnitureInspection[0].notesClient.split("\n").length;
      if (furnitureInspection[0].notesInspector !== "")
        counter += furnitureInspection[0].notesInspector.split("\n").length;
      return counter;
    }
  }

  uploadBeforePic(furnitureId, imageData) {
    this.filesProvider
      .uploadBeforePic(furnitureId, imageData)
      .then()
      .catch(() => {
        this.toast
          .create({
            message:
              "La imagen no pudo ser subida en el momento. Intente más tarde",
            duration: 3000,
            position: "bottom center"
          })
          .present();
      });
  }

  uploadAfterPic(furnitureId, imageData) {
    this.filesProvider
      .uploadAfterPic(furnitureId, imageData)
      .then()
      .catch(() => {
        this.toast
          .create({
            message:
              "La imagen no pudo ser subida en el momento. Intente más tarde",
            duration: 3000,
            position: "bottom center"
          })
          .present();
      });
  }

  takePicture(isBefore: boolean, furnitureId: string) {
    this.cameraCtrl.getPicture(this.options).then(
      imageData => {
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        if (isBefore) this.uploadBeforePic(furnitureId, imageData);
        else this.uploadAfterPic(furnitureId, imageData);
      },
      err => {
        // Handle error
      }
    );
  }

  selectPictureFromGallery(isBefore: boolean, furnitureId: string) {
    this.cameraCtrl.getPicture(this.optionsGallery).then(
      imageData => {
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        if (isBefore) this.uploadBeforePic(furnitureId, imageData);
        else this.uploadAfterPic(furnitureId, imageData);
      },
      err => {
        // Handle error
      }
    );
  }

  goToNotes(furniture) {
    if (furniture.furnitureInspections.length > 0)
      this.modalCtrl
        .create(NotesPage, {
          furniture: furniture.furnitureInspections[0]
        })
        .present();
    else {
      let data = {
        furnitureId: furniture.id,
        serviceId: this.serviceId
      };
      this.inspectionProvider
        .createInspection(data)
        .then(result => {
          console.log();
          furniture.furnitureInspections[0] = result;
          /* this.navCtrl.push(NotesPage, {
            furniture: furniture.furnitureInspections[0]
          }); */
          this.modalCtrl
            .create(NotesPage, {
              furniture: furniture.furnitureInspections[0]
            })
            .present();
        })
        .catch(err => {
          console.log(err);
          this.toast
            .create({
              message: "Hubo un error",
              duration: 3000,
              position: "bottom center"
            })
            .present();
        });
    }
  }

  finishItem() {
    this.itemProvider
      .finishiIem(this.item.id)
      .then(result => {
        this.navCtrl.pop();
        console.log("resultado", result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  ionViewDidLoad() {
    this.init();
  }

  ionViewDidEnter() {
    this.updateFurnitures();
  }

  presentActionSheet(furniture: any) {
    let actionSheetInfo: any = {};

    this.translate.get("itemDetail.takePic.title").subscribe(lang => {
      actionSheetInfo.title = lang;
    });
    this.translate.get("itemDetail.takePic.beforePic").subscribe(lang => {
      actionSheetInfo.beforePic = lang;
    });
    this.translate.get("itemDetail.takePic.afterPic").subscribe(lang => {
      actionSheetInfo.afterPic = lang;
    });
    this.translate.get("itemDetail.takePic.selectSource").subscribe(lang => {
      actionSheetInfo.selectSource = lang;
    });
    this.translate.get("itemDetail.takePic.messageSource").subscribe(lang => {
      actionSheetInfo.messageSource = lang;
    });
    this.translate.get("itemDetail.takePic.gallery").subscribe(lang => {
      actionSheetInfo.gallery = lang;
    });
    this.translate.get("itemDetail.takePic.camera").subscribe(lang => {
      actionSheetInfo.camera = lang;
    });
    this.translate.get("itemDetail.takePic.seePics").subscribe(lang => {
      actionSheetInfo.seePics = lang;
    });
    this.translate.get("itemDetail.takePic.pictures").subscribe(lang => {
      actionSheetInfo.pictures = lang;
    });
    this.translate.get("itemDetail.takePic.pictureMessage").subscribe(lang => {
      actionSheetInfo.pictureMessage = lang;
    });
    this.translate.get("itemDetail.takePic.before").subscribe(lang => {
      actionSheetInfo.before = lang;
    });
    this.translate.get("itemDetail.takePic.after").subscribe(lang => {
      actionSheetInfo.after = lang;
    });
    this.translate.get("shared.cancel").subscribe(lang => {
      actionSheetInfo.cancel = lang;
    });

    if (furniture.furnitureInspections.length === 0) {
      let data = {
        furnitureId: furniture.id,
        serviceId: this.serviceId
      };
      this.inspectionProvider
        .createInspection(data)
        .then(result => {
          furniture.furnitureInspections[0] = result;
        })
        .catch(err => {
          this.toast
            .create({
              message: "Hubo un error",
              duration: 3000,
              position: "bottom center"
            })
            .present();
        });
    }
    let actionSheet = this.actionSheet.create({
      title: actionSheetInfo.title,
      buttons: [
        {
          text: actionSheetInfo.beforePic,
          handler: () => {
            this.alertCtrl
              .create({
                title: actionSheetInfo.selectSource,
                message: actionSheetInfo.messageSource,
                buttons: [
                  {
                    text: actionSheetInfo.gallery,
                    handler: () => {
                      this.selectPictureFromGallery(
                        true,
                        furniture.furnitureInspections[0].id
                      );
                    }
                  },
                  {
                    text: actionSheetInfo.camera,
                    handler: () => {
                      this.takePicture(
                        true,
                        furniture.furnitureInspections[0].id
                      );
                    }
                  }
                ]
              })
              .present();
          }
        },
        {
          text: actionSheetInfo.afterPic,
          handler: () => {
            this.alertCtrl
              .create({
                title: actionSheetInfo.selectSource,
                message: actionSheetInfo.messageSource,
                buttons: [
                  {
                    text: actionSheetInfo.gallery,
                    handler: () => {
                      this.selectPictureFromGallery(
                        false,
                        furniture.furnitureInspections[0].id
                      );
                    }
                  },
                  {
                    text: actionSheetInfo.camera,
                    handler: () => {
                      this.takePicture(
                        false,
                        furniture.furnitureInspections[0].id
                      );
                    }
                  }
                ]
              })
              .present();
            // this.takePicture(false, furniture.furnitureInspections[0].id);
          }
        },
        {
          text: actionSheetInfo.seePics,
          handler: () => {
            this.alertCtrl
              .create({
                title: actionSheetInfo.pictures,
                message: actionSheetInfo.pictureMessage,
                buttons: [
                  {
                    text: actionSheetInfo.before,
                    handler: () => {
                      this.goToSlide(furniture.furnitureInspections[0], true);
                      // console.log('Archive clicked');
                    }
                  },
                  {
                    text: actionSheetInfo.after,
                    handler: () => {
                      this.goToSlide(furniture.furnitureInspections[0], false);
                    }
                  }
                ]
              })
              .present();
          }
        },
        {
          text: actionSheetInfo.cancel,
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }
}
