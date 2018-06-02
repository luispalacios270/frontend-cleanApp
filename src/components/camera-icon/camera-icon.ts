import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  NgZone
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ItemInspectionProvider } from '../../providers/item-inspection/item-inspection';
import {
  ToastController,
  AlertController,
  ActionSheetController,
  ModalController
} from 'ionic-angular';
import { FilesProvider } from '../../providers/files/files';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PicturePage } from '../../pages/picture/picture';

interface Furniture {
  name: string;
  id: string;
  itemId: string;
  furnitureInspections: FurnitureInspection[];
}

interface FurnitureInspection {
  qualification: number;
  notesClient: string;
  notesInspector: string;
  notesActionPlan: string;
  notesAdministrator: string;
  id: string;
  furnitureId: string;
  serviceId: string;
}

@Component({
  selector: 'camera-icon',
  templateUrl: 'camera-icon.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraIconComponent implements OnInit {
  @Input() serviceId: string;
  @Input() furniture: Furniture;
  hasPicsAfter = false;
  hasPicsBefore = false;

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
    private inspectionProvider: ItemInspectionProvider,
    private toast: ToastController,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private actionSheet: ActionSheetController,
    private filesProvider: FilesProvider,
    private cameraCtrl: Camera,
    private modalCtrl: ModalController,
    private ngZone: NgZone
  ) { }

  checkIfFurnitureHasPics(): void {
    if (this.furniture.furnitureInspections.length > 0) {
      const furnitureId = this.furniture.furnitureInspections[0].id;
      this.filesProvider
        .isThereBeforePics(furnitureId)
        .subscribe(_ => this.ngZone.run(() => (this.hasPicsBefore = true)));

      this.filesProvider
        .isThereAfterPics(furnitureId)
        .subscribe(_ => this.ngZone.run(() => (this.hasPicsAfter = true)));
    }
  }

  ngOnInit(): void {
    this.checkIfFurnitureHasPics();
  }

  goToSlide(furnitureId: string, isBeforePic: boolean) {
    let profileModal = this.modalCtrl.create(PicturePage, {
      furnitureId: furnitureId,
      isBeforePic: isBeforePic
    });
    profileModal.present();
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

  uploadBeforePic(furnitureId, imageData) {
    this.filesProvider
      .uploadBeforePic(furnitureId, imageData)
      .then(_ => this.checkIfFurnitureHasPics())
      .catch(() => {
        this.printError();
      });
  }

  uploadAfterPic(furnitureId, imageData) {
    this.filesProvider
      .uploadAfterPic(furnitureId, imageData)
      .then(_ => this.checkIfFurnitureHasPics())
      .catch(() => {
        this.printError();
      });
  }

  selectPictureFromGallery(isBefore: boolean, furnitureId: string) {
    this.cameraCtrl.getPicture(this.optionsGallery).then(
      imageData => {

        if (isBefore) this.uploadBeforePic(furnitureId, imageData);
        else this.uploadAfterPic(furnitureId, imageData);
      },
      err => {


      }
    );
  }

  presentActionSheet(furniture: any): void {
    let actionSheetInfo: any = {};

    this.translate.get('itemDetail.takePic.title').subscribe(lang => {
      actionSheetInfo.title = lang;
    });
    this.translate.get('itemDetail.takePic.beforePic').subscribe(lang => {
      actionSheetInfo.beforePic = lang;
    });
    this.translate.get('itemDetail.takePic.afterPic').subscribe(lang => {
      actionSheetInfo.afterPic = lang;
    });
    this.translate.get('itemDetail.takePic.selectSource').subscribe(lang => {
      actionSheetInfo.selectSource = lang;
    });
    this.translate.get('itemDetail.takePic.messageSource').subscribe(lang => {
      actionSheetInfo.messageSource = lang;
    });
    this.translate.get('itemDetail.takePic.gallery').subscribe(lang => {
      actionSheetInfo.gallery = lang;
    });
    this.translate.get('itemDetail.takePic.camera').subscribe(lang => {
      actionSheetInfo.camera = lang;
    });
    this.translate.get('itemDetail.takePic.seePics').subscribe(lang => {
      actionSheetInfo.seePics = lang;
    });
    this.translate.get('itemDetail.takePic.pictures').subscribe(lang => {
      actionSheetInfo.pictures = lang;
    });
    this.translate.get('itemDetail.takePic.pictureMessage').subscribe(lang => {
      actionSheetInfo.pictureMessage = lang;
    });
    this.translate.get('itemDetail.takePic.before').subscribe(lang => {
      actionSheetInfo.before = lang;
    });
    this.translate.get('itemDetail.takePic.after').subscribe(lang => {
      actionSheetInfo.after = lang;
    });
    this.translate.get('shared.cancel').subscribe(lang => {
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
          this.translate.get('shared.error').subscribe(lang => {
            this.toast
              .create({
                message: lang,
                duration: 3000,
                position: 'bottom center'
              })
              .present();
          });
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
                    text: `${actionSheetInfo.before}${
                    this.hasPicsBefore ? '*' : ''
                    }`,
                    handler: () => {
                      this.goToSlide(furniture.furnitureInspections[0], true);
                    }
                  },
                  {
                    text: `${actionSheetInfo.after}${
                    this.hasPicsAfter ? '*' : ''
                    }`,
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
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  printError(): void {
    this.translate.get('shared.error').subscribe(lang => {
      this.toast
        .create({
          message: lang,
          duration: 3000,
          position: 'bottom center'
        })
        .present();
    });
  }
}
